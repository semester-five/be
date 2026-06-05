import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionCICOFaceCommand } from '../implements/session-cico-face.command';
import { SessionsRepository } from 'src/modules/sessions/repositories/sessions.repository';
import { LockersRepository } from 'src/modules/lockers/repositories/lockers.repository';
import { Session } from 'src/modules/sessions/domain/session';
import { SessionStatusVO } from 'src/modules/sessions/value-objects/session-status.vo';
import { AuthMethodVO } from 'src/modules/sessions/value-objects/auth-method.vo';
import { LockerStatusVO } from 'src/modules/lockers/value-objects/locker-status.vo';
import { ServiceUnavailableException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      similarSession.status = SessionStatusVO.CHECKED_OUT;

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
      status: SessionStatusVO.CHECKED_IN,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    openUrl: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lockerCode: string,
  ): Promise<void> {
    // try {
    // await axios.get(openUrl, { timeout: 5000 });
    // } catch {
    // throw new ServiceUnavailableException({
    //   code: 'DOOR_OPEN_FAILED',
    //   message: `Unable to open locker door for ${lockerCode}`,
    // });
    // console.warn(
    //   `Failed to open locker door for ${lockerCode}, but session will proceed`,
    // );
    // }
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

    return highestSimilarity >= 0.6 ? mostSimilarSession : null;
  }

  private compareFaceVectors(vectorA: number[], vectorB: number[]): number {
    if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
      throw new Error('Face vectors must be arrays');
    }

    if (vectorA.length === 0 || vectorB.length === 0) {
      throw new Error('Face vectors must not be empty');
    }

    if (vectorA.length !== vectorB.length) {
      throw new Error(
        `Face vectors must be of the same length: ${vectorA.length} !== ${vectorB.length}`,
      );
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      const a = Number(vectorA[i]);
      const b = Number(vectorB[i]);

      if (!Number.isFinite(a) || !Number.isFinite(b)) {
        throw new Error(`Invalid face vector value at index ${i}`);
      }

      dotProduct += a * b;
      normA += a * a;
      normB += b * b;
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);

    if (denominator <= Number.EPSILON) {
      return 0;
    }

    return dotProduct / denominator;
  }
}
