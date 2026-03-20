import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionCheckOutCommand } from '../implements/session-check-out.command';
import { SessionsRepository } from 'src/modules/sessions/repositories/sessions.repository';
import { LockersRepository } from 'src/modules/lockers/repositories/lockers.repository';
import { FaceRecognitionService } from 'src/modules/face-recognition/face-recognition.service';
import { QRTokensService } from 'src/modules/qr-tokens/qr-tokens.service';
import { Session } from 'src/modules/sessions/domain/session';
import { SessionStatusVO } from 'src/modules/sessions/value-objects/session-status.vo';
import { AuthMethodVO } from 'src/modules/sessions/value-objects/auth-method.vo';
import { LockerStatusVO } from 'src/modules/lockers/value-objects/locker-status.vo';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@CommandHandler(SessionCheckOutCommand)
export class SessionCheckOutCommandHandler implements ICommandHandler<SessionCheckOutCommand> {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly lockersRepository: LockersRepository,
    private readonly faceRecognitionService: FaceRecognitionService,
    private readonly qrTokensService: QRTokensService,
  ) {}

  async execute(command: SessionCheckOutCommand): Promise<Session> {
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

    let isValid = false;

    if (command.faceImage && session.authMethod === AuthMethodVO.FACE_ID) {
      if (!session.guestFaceVector) {
        throw new BadRequestException({
          code: 'NO_FACE_DATA',
          message: 'No face data available',
        });
      }

      const confidence = await this.faceRecognitionService.verifyFace(
        command.faceImage.buffer,
        session.guestFaceVector,
      );

      if (confidence >= 0.8) {
        isValid = true;
      }
    }

    if (command.qrToken && session.authMethod === AuthMethodVO.QR_CODE) {
      const verified = await this.qrTokensService.verifyToken(command.qrToken);
      if (verified.valid && verified.sessionId === command.sessionId) {
        isValid = true;
      }
    }

    if (!isValid) {
      throw new UnauthorizedException({
        message: 'Authentication failed',
      });
    }

    session.complete();
    await this.sessionsRepository.update(session);

    await this.lockersRepository.updateStatus(
      session.lockerId,
      LockerStatusVO.AVAILABLE,
    );

    return session;
  }
}
