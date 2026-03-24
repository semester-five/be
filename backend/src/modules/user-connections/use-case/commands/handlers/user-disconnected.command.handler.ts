import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDisconnectedCommand } from '../implements/user-disconnected.command';
import { Inject } from '@nestjs/common';
import { IUserConnectionsRepository } from 'src/modules/user-connections/domain/repositories/user-connection.repository';
import { UserConnectionNotFoundException } from 'src/modules/user-connections/domain/exceptions/user-connection-not-found.exception';
import { StatusEnum } from 'src/modules/user-connections/domain/value-objects/status.vo';
import { USER_CONNECTION_DI_TOKEN } from 'src/modules/user-connections/user-connection.di-token';

@CommandHandler(UserDisconnectedCommand)
export class UserDisconnectedCommandHandler implements ICommandHandler<UserDisconnectedCommand> {
  constructor(
    @Inject(USER_CONNECTION_DI_TOKEN.REPOSITORY)
    private readonly repository: IUserConnectionsRepository,
  ) {}

  async execute(command: UserDisconnectedCommand): Promise<void> {
    const userConnection = await this.repository.findByUserId(command.userId);

    if (!userConnection) {
      throw new UserConnectionNotFoundException(command.userId);
    }

    await this.repository.save({
      ...userConnection,
      status: StatusEnum.INACTIVE,
      lastOnlineAt: new Date(),
    });
  }
}
