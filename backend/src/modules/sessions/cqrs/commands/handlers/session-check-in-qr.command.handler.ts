import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionCheckInQRCommand } from '../implements/session-check-in-qr.command';
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
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

@CommandHandler(SessionCheckInQRCommand)
export class SessionCheckInQRCommandHandler implements ICommandHandler<SessionCheckInQRCommand> {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly lockersRepository: LockersRepository,
    private readonly qrTokensService: QRTokensService,
  ) {}

  async execute(command: SessionCheckInQRCommand): Promise<Session> {
    const verifiedToken = await this.qrTokensService.verifyToken(
      command.qrToken,
    );

    if (!verifiedToken.valid) {
      throw new BadRequestException({
        code: 'INVALID_QR_TOKEN',
        message: 'QR token is invalid or expired',
      });
    }

    if (verifiedToken.action !== 'check_in') {
      throw new BadRequestException({
        code: 'INVALID_QR_ACTION',
        message: 'QR token is not for check-in action',
      });
    }

    const availableLocker = await this.lockersRepository.findAvailableLocker();

    if (!availableLocker) {
      throw new ServiceUnavailableException({
        code: 'NO_AVAILABLE_LOCKER',
        message: 'No available lockers',
      });
    }

    const session = Session.create({
      userId: verifiedToken.userId as Uuid,
      lockerId: availableLocker.id,
      checkInAt: new Date(),
      checkOutAt: null,
      status: SessionStatusVO.ACTIVE,
      authMethod: AuthMethodVO.QR_CODE,
      guestFaceVector: null,
      qrTokenId: verifiedToken.tokenId ?? null,
    });

    await this.sessionsRepository.save(session);

    await this.lockersRepository.updateStatus(
      availableLocker.id,
      LockerStatusVO.IN_USE,
    );

    if (verifiedToken.tokenId) {
      await this.qrTokensService.markAsUsed(verifiedToken.tokenId);
    }

    return session;
  }
}
