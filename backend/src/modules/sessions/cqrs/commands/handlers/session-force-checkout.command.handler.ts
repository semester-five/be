import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionForceCheckOutCommand } from '../implements/session-force-checkout.command';
import { SessionsRepository } from 'src/modules/sessions/repositories/sessions.repository';
import { LockersRepository } from 'src/modules/lockers/repositories/lockers.repository';
import { Session } from 'src/modules/sessions/domain/session';
import { SessionStatusVO } from 'src/modules/sessions/value-objects/session-status.vo';
import { LockerStatusVO } from 'src/modules/lockers/value-objects/locker-status.vo';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@CommandHandler(SessionForceCheckOutCommand)
export class SessionForceCheckOutCommandHandler implements ICommandHandler<SessionForceCheckOutCommand> {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly lockersRepository: LockersRepository,
  ) {}

  async execute(command: SessionForceCheckOutCommand): Promise<Session> {
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

    session.complete();
    await this.sessionsRepository.update(session);

    await this.lockersRepository.updateStatus(
      session.lockerId,
      LockerStatusVO.AVAILABLE,
    );

    return session;
  }
}
