import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionForceCheckOutCommand } from '../implements/session-force-checkout.command';
import { SessionsRepository } from 'src/modules/sessions/repositories/sessions.repository';
import { LockersRepository } from 'src/modules/lockers/repositories/lockers.repository';
import { Session } from 'src/modules/sessions/domain/session';
import { SessionStatusVO } from 'src/modules/sessions/value-objects/session-status.vo';
import { LockerStatusVO } from 'src/modules/lockers/value-objects/locker-status.vo';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MqttService } from 'src/modules/mqtt/mqtt.service';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

const CABINET_1_ID = '11111111-1111-1111-1111-111111111111' as Uuid;
const CABINET_2_ID = '22222222-2222-2222-2222-222222222222' as Uuid;

@CommandHandler(SessionForceCheckOutCommand)
export class SessionForceCheckOutCommandHandler implements ICommandHandler<SessionForceCheckOutCommand> {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly lockersRepository: LockersRepository,
    private readonly mqttService: MqttService,
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

    await this.sessionsRepository.update(session);

    await this.lockersRepository.updateStatus(
      session.lockerId,
      LockerStatusVO.AVAILABLE,
    );

    const cabinet =
      session.lockerId === CABINET_1_ID
        ? 1
        : session.lockerId === CABINET_2_ID
          ? 2
          : 0;

    if (cabinet !== 0) {
      this.mqttService.publish('lockers/commands', {
        type: 'CLOSE',
        cabinet,
      });
    }

    return session;
  }
}
