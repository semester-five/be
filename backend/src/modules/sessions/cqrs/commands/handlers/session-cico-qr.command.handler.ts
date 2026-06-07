import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionCICOQRCommand } from '../implements/session-cico-qr.command';
import { SessionsRepository } from 'src/modules/sessions/repositories/sessions.repository';
import { LockersRepository } from 'src/modules/lockers/repositories/lockers.repository';
import { QRTokensService } from 'src/modules/qr-tokens/qr-tokens.service';
import { Session } from 'src/modules/sessions/domain/session';
import { SessionStatusVO } from 'src/modules/sessions/value-objects/session-status.vo';
import { AuthMethodVO } from 'src/modules/sessions/value-objects/auth-method.vo';
import { LockerStatusVO } from 'src/modules/lockers/value-objects/locker-status.vo';
import {
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { MqttService } from 'src/modules/mqtt/mqtt.service';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

const CABINET_1_ID = '11111111-1111-1111-1111-111111111111' as Uuid;
const CABINET_2_ID = '22222222-2222-2222-2222-222222222222' as Uuid;

@CommandHandler(SessionCICOQRCommand)
export class SessionCICOQRCommandHandler implements ICommandHandler<SessionCICOQRCommand> {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly lockersRepository: LockersRepository,
    private readonly qrTokensService: QRTokensService,
    private readonly mqttService: MqttService,
  ) {}

  async execute(command: SessionCICOQRCommand): Promise<Session> {
    const verifiedToken = await this.qrTokensService.verifyToken(
      command.qrToken,
    );

    if (!verifiedToken) {
      throw new BadRequestException({
        code: 'INVALID_QR_TOKEN',
        message: 'QR token is invalid or expired',
      });
    }

    const activeSession = await this.sessionsRepository.findActiveByUserId(
      verifiedToken.userId,
    );

    if (activeSession) {
      const completedSession = {
        ...activeSession,
        checkOutAt: new Date(),
        status: SessionStatusVO.CHECKED_OUT,
      } as Session;

      await this.sessionsRepository.save(completedSession);

      await this.lockersRepository.updateStatus(
        activeSession.lockerId,
        LockerStatusVO.AVAILABLE,
      );

      const cabinet = this.toCabinet(activeSession.lockerId);
      if (cabinet) {
        this.mqttService.publish('lockers/commands', { type: 'OPEN', cabinet });
      }

      await this.qrTokensService.markAsUsed(verifiedToken.id);

      return completedSession;
    }

    const availableLocker = await this.lockersRepository.findAvailableLocker();

    if (!availableLocker) {
      throw new ServiceUnavailableException({
        code: 'NO_AVAILABLE_LOCKER',
        message: 'No available lockers',
      });
    }

    const session = Session.create({
      userId: verifiedToken.userId,
      lockerId: availableLocker.id,
      locker: availableLocker,
      checkInAt: new Date(),
      checkOutAt: null,
      status: SessionStatusVO.CHECKED_IN,
      authMethod: AuthMethodVO.QR_CODE,
      age: null,
      gender: null,
      guestFaceVector: null,
      qrTokenId: verifiedToken?.id || null,
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

    if (verifiedToken) {
      await this.qrTokensService.markAsUsed(verifiedToken.id);
    }

    return session;
  }

  private toCabinet(lockerId: Uuid): number | null {
    if (lockerId === CABINET_1_ID) return 1;
    if (lockerId === CABINET_2_ID) return 2;
    return null;
  }
}
