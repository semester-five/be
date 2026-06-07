import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionCICOFaceCommand } from '../implements/session-cico-face.command';
import { SessionsRepository } from 'src/modules/sessions/repositories/sessions.repository';
import { LockersRepository } from 'src/modules/lockers/repositories/lockers.repository';
import { Session } from 'src/modules/sessions/domain/session';
import { SessionStatusVO } from 'src/modules/sessions/value-objects/session-status.vo';
import { AuthMethodVO } from 'src/modules/sessions/value-objects/auth-method.vo';
import { LockerStatusVO } from 'src/modules/lockers/value-objects/locker-status.vo';
import { ServiceUnavailableException } from '@nestjs/common';
import { MqttService } from 'src/modules/mqtt/mqtt.service';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

const CABINET_1_ID = '11111111-1111-1111-1111-111111111111' as Uuid;
const CABINET_2_ID = '22222222-2222-2222-2222-222222222222' as Uuid;

@CommandHandler(SessionCICOFaceCommand)
export class SessionCICOFaceCommandHandler implements ICommandHandler<SessionCICOFaceCommand> {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly lockersRepository: LockersRepository,
    private readonly mqttService: MqttService,
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

      const cabinet = this.toCabinet(similarSession.lockerId);
      if (cabinet) {
        this.mqttService.publish('lockers/commands', { type: 'OPEN', cabinet });
      }

      return similarSession;
    }

    const availableLocker = await this.lockersRepository.findAvailableLocker();

    if (!availableLocker) {
      throw new ServiceUnavailableException({
        code: 'NO_AVAILABLE_LOCKER',
        message: 'No available lockers',
      });
    }

    console.log('Gender:', command.gender);

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

    const cabinet = this.toCabinet(availableLocker.id);
    if (cabinet) {
      this.mqttService.publish('lockers/commands', { type: 'OPEN', cabinet });
    }

    return session;
  }

  private toCabinet(lockerId: Uuid): number | null {
    if (lockerId === CABINET_1_ID) return 1;
    if (lockerId === CABINET_2_ID) return 2;
    return null;
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
