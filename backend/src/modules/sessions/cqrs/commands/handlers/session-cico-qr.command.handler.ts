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

@CommandHandler(SessionCICOQRCommand)
export class SessionCICOQRCommandHandler implements ICommandHandler<SessionCICOQRCommand> {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly lockersRepository: LockersRepository,
    private readonly qrTokensService: QRTokensService,
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
        status: SessionStatusVO.COMPLETED,
      } as Session;

      this.sessionsRepository.save(completedSession);

      await this.lockersRepository.updateStatus(
        activeSession.lockerId,
        LockerStatusVO.AVAILABLE,
      );

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
      status: SessionStatusVO.ACTIVE,
      authMethod: AuthMethodVO.QR_CODE,
      guestFaceVector: null,
      qrTokenId: verifiedToken?.id || null,
    });

    await this.sessionsRepository.save(session);

    await this.lockersRepository.updateStatus(
      availableLocker.id,
      LockerStatusVO.IN_USE,
    );

    if (verifiedToken) {
      await this.qrTokensService.markAsUsed(verifiedToken.id);
    }

    return session;
  }
}
