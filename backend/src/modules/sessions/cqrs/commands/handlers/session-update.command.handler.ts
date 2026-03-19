import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionUpdateCommand } from '../implements/session-update.command';
import { SessionsRepository } from 'src/modules/sessions/repositories/sessions.repository';
import { FaceRecognitionService } from 'src/modules/face-recognition/face-recognition.service';
import { QRTokensService } from 'src/modules/qr-tokens/qr-tokens.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SessionStatusVO } from 'src/modules/sessions/value-objects/session-status.vo';
import { AuthMethodVO } from 'src/modules/sessions/value-objects/auth-method.vo';

@CommandHandler(SessionUpdateCommand)
export class SessionUpdateCommandHandler implements ICommandHandler<SessionUpdateCommand> {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly faceRecognitionService: FaceRecognitionService,
    private readonly qrTokensService: QRTokensService,
  ) {}

  async execute(command: SessionUpdateCommand): Promise<void> {
    const session = await this.sessionsRepository.findById(command.sessionId);

    if (!session) {
      throw new NotFoundException({
        code: 'SESSION_NOT_FOUND',
        message: 'Session not found',
      });
    }

    if (session.status !== SessionStatusVO.ACTIVE) {
      throw new BadRequestException({
        code: 'INVALID_SESSION_STATUS',
        message: 'Session is no longer active',
      });
    }

    if (command.faceImage && session.authMethod === AuthMethodVO.FACE_ID) {
      const currentVector = session.guestFaceVector;
      if (!currentVector) {
        throw new BadRequestException({
          code: 'NO_FACE_DATA',
          message: 'No face data available',
        });
      }

      const confidence = await this.faceRecognitionService.verifyFace(
        command.faceImage.buffer,
        currentVector,
      );

      if (confidence < 0.8) {
        throw new BadRequestException({
          code: 'FACE_MISMATCH',
          message: 'Face does not match',
        });
      }
    }

    if (command.qrToken && session.authMethod === AuthMethodVO.QR_CODE) {
      const verified = await this.qrTokensService.verifyToken(command.qrToken);
      if (!verified.valid || verified.sessionId !== command.sessionId) {
        throw new BadRequestException({
          code: 'INVALID_QR_TOKEN',
          message: 'Invalid QR token',
        });
      }
    }
  }
}
