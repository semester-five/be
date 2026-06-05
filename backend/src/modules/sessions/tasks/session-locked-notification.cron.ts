import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CommandBus } from '@nestjs/cqrs';
import { SessionsRepository } from '../repositories/sessions.repository';
import { NotificationCreateByEventCodeCommand } from 'src/modules/notifications/use-case/commands/implements/notification-create-by-event-code.command';

@Injectable()
export class SessionLockedNotificationCron {
  private readonly logger: Logger = new Logger(
    SessionLockedNotificationCron.name,
  );

  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Cron('0 */5 * * * *')
  async handle(): Promise<void> {
    this.logger.debug(
      'Start a cron job to check for sessions locked over 24 hours',
    );
    const now = new Date();
    const olderThan24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const olderThan24HoursAnd5Minutes = new Date(
      now.getTime() - 24 * 60 * 60 * 1000 - 5 * 60 * 1000,
    );

    const matchedSessions =
      await this.sessionsRepository.findActiveSessionsCheckedInBetween(
        olderThan24HoursAnd5Minutes,
        olderThan24Hours,
      );

    await Promise.all(
      matchedSessions.map((session) =>
        this.commandBus.execute(
          new NotificationCreateByEventCodeCommand('LOCKER_LOCKED_OVER_24H', {
            lockerCode: session.locker.code,
            location: session.locker.location,
            durationHours: Math.floor(
              (now.getTime() - session.checkInAt.getTime()) / (60 * 60 * 1000),
            ),
            actionUrl: `/sessions/${session.id}`,
          }),
        ),
      ),
    );
    this.logger.debug(
      `Finished processing ${matchedSessions.length} sessions locked over 24 hours`,
    );
  }
}
