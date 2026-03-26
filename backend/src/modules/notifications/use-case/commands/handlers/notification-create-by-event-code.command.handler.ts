import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { NotificationCreateByEventCodeCommand } from '../implements/notification-create-by-event-code.command';
import { EVENT_DI_TOKEN } from 'src/modules/events/events.di-token';
import { IEventRepository } from 'src/modules/events/domain/repositories/event.repository';
import { UserConnectionGetByUserIdsQuery } from 'src/modules/user-connections/use-case/queries/implements/user-connection-get-by-user-ids.query';
import { QueryBus } from '@nestjs/cqrs';
import { UserRepository } from 'src/modules/user/repository/user.repository';
import { NotificationCreateCommand } from '../implements/notification-create.command';
import { UserConnection } from 'src/modules/user-connections/domain/entities/user-connection';

@CommandHandler(NotificationCreateByEventCodeCommand)
export class NotificationCreateByEventCodeCommandHandler implements ICommandHandler<NotificationCreateByEventCodeCommand> {
  constructor(
    @Inject(EVENT_DI_TOKEN.REPOSITORY)
    private readonly eventRepository: IEventRepository,
    private readonly userRepository: UserRepository,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: NotificationCreateByEventCodeCommand): Promise<void> {
    const event = await this.eventRepository.findByCode(command.eventCode);

    if (!event) {
      return;
    }

    const adminIds = await this.userRepository.findAdminIds();

    if (!adminIds.length) {
      return;
    }

    const activeConnections = await this.queryBus.execute<UserConnection[]>(
      new UserConnectionGetByUserIdsQuery(adminIds),
    );

    if (!activeConnections.length) {
      return;
    }

    await Promise.all(
      activeConnections.map((connection) =>
        this.commandBus.execute(
          new NotificationCreateCommand(
            connection.userId,
            command.eventCode,
            command.params,
          ),
        ),
      ),
    );
  }
}
