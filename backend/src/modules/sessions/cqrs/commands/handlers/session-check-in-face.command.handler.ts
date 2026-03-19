import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionCheckInFaceCommand } from '../implements/session-check-in-face.command';
import { SessionsRepository } from 'src/modules/sessions/repositories/sessions.repository';
import { LockersRepository } from 'src/modules/lockers/repositories/lockers.repository';
import { FaceRecognitionService } from 'src/modules/face-recognition/face-recognition.service';
import { Session } from 'src/modules/sessions/domain/session';
import { SessionStatusVO } from 'src/modules/sessions/value-objects/session-status.vo';
import { AuthMethodVO } from 'src/modules/sessions/value-objects/auth-method.vo';
import { LockerStatusVO } from 'src/modules/lockers/value-objects/locker-status.vo';
import { ServiceUnavailableException } from '@nestjs/common';

@CommandHandler(SessionCheckInFaceCommand)
export class SessionCheckInFaceCommandHandler implements ICommandHandler<SessionCheckInFaceCommand> {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly lockersRepository: LockersRepository,
    private readonly faceRecognitionService: FaceRecognitionService,
  ) {}

  async execute(command: SessionCheckInFaceCommand): Promise<Session> {
    const faceVector = await this.faceRecognitionService.getFaceVector(
      command.faceImage.buffer,
    );

    const availableLocker = await this.lockersRepository.findAvailableLocker();

    if (!availableLocker) {
      throw new ServiceUnavailableException({
        code: 'NO_AVAILABLE_LOCKER',
        message: 'No available lockers',
      });
    }

    const session = Session.create({
      userId: null,
      lockerId: availableLocker.id,
      checkInAt: new Date(),
      checkOutAt: null,
      status: SessionStatusVO.ACTIVE,
      authMethod: AuthMethodVO.FACE_ID,
      guestFaceVector: faceVector,
      qrTokenId: null,
    });

    await this.sessionsRepository.save(session);

    await this.lockersRepository.updateStatus(
      availableLocker.id,
      LockerStatusVO.IN_USE,
    );

    return session;
  }
}
