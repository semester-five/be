import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionCICOFaceCommand } from '../implements/session-cico-face.command';
import { SessionsRepository } from 'src/modules/sessions/repositories/sessions.repository';
import { LockersRepository } from 'src/modules/lockers/repositories/lockers.repository';
import { Session } from 'src/modules/sessions/domain/session';
import { SessionStatusVO } from 'src/modules/sessions/value-objects/session-status.vo';
import { AuthMethodVO } from 'src/modules/sessions/value-objects/auth-method.vo';
import { LockerStatusVO } from 'src/modules/lockers/value-objects/locker-status.vo';
import { ServiceUnavailableException } from '@nestjs/common';
import axios from 'axios';

@CommandHandler(SessionCICOFaceCommand)
export class SessionCICOFaceCommandHandler implements ICommandHandler<SessionCICOFaceCommand> {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly lockersRepository: LockersRepository,
  ) {}

  async execute(command: SessionCICOFaceCommand): Promise<Session> {
    const activeSessions =
      await this.sessionsRepository.findByFaceMethodAndActive();

    const similarSession = this.findTheSimilarFace(
      activeSessions,
      command.faceVector,
    );

    if (similarSession) {
      similarSession.checkOutAt = new Date();
      similarSession.status = SessionStatusVO.COMPLETED;

      await this.sessionsRepository.save(similarSession);

      await this.lockersRepository.updateStatus(
        similarSession.lockerId,
        LockerStatusVO.AVAILABLE,
      );

      return similarSession;
    }

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
      locker: availableLocker,
      checkInAt: new Date(),
      checkOutAt: null,
      status: SessionStatusVO.ACTIVE,
      authMethod: AuthMethodVO.FACE_ID,
      age: command.age,
      gender: command.gender,
      guestFaceVector: command.faceVector,
      qrTokenId: null,
    });

    await this.sessionsRepository.save(session);

    await this.lockersRepository.updateStatus(
      availableLocker.id,
      LockerStatusVO.IN_USE,
    );

    await this.openLockerDoor(availableLocker.openUrl, availableLocker.code);

    return session;
  }

  private async openLockerDoor(
    openUrl: string,
    lockerCode: string,
  ): Promise<void> {
    try {
      await axios.get(openUrl, { timeout: 5000 });
    } catch {
      throw new ServiceUnavailableException({
        code: 'DOOR_OPEN_FAILED',
        message: `Unable to open locker door for ${lockerCode}`,
      });
    }
  }

  private findTheSimilarFace(
    activeSessions: Session[],
    faceVector: number[],
  ): Session | null {
    let mostSimilarSession: Session | null = null;
    let highestSimilarity = 0;

    for (const session of activeSessions) {
      if (!session.guestFaceVector) continue;

      const similarity = this.compareFaceVectors(
        session.guestFaceVector,
        faceVector,
      );

      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        mostSimilarSession = session;
      }
    }

    return mostSimilarSession;
  }

  private compareFaceVectors(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) {
      throw new Error('Face vectors must be of the same length');
    }

    const dotProduct = vectorA.reduce(
      (sum, value, index) => sum + value * vectorB[index],
      0,
    );
    const normA = Math.sqrt(
      vectorA.reduce((sum, value) => sum + value * value, 0),
    );
    const normB = Math.sqrt(
      vectorB.reduce((sum, value) => sum + value * value, 0),
    );
    const denominator = normA * normB;

    if (denominator === 0) {
      return 0;
    }

    return dotProduct / denominator;
  }
}
