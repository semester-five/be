import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserConnectedCommand } from '../implements/user-connected.command';
import { Inject } from '@nestjs/common';
import { IUserConnectionsRepository } from 'src/modules/user-connections/domain/repositories/user-connection.repository';
import { StatusEnum } from 'src/modules/user-connections/domain/value-objects/status.vo';
import { UserConnection } from 'src/modules/user-connections/domain/entities/user-connection';
import { SubscriptionCreateByUserIdCommand } from 'src/modules/subscriptions/use-case/commands/implements/subscription-create-by-user-id.command';
import { USER_CONNECTION_DI_TOKEN } from 'src/modules/user-connections/user-connection.di-token';

@CommandHandler(UserConnectedCommand)
export class UserConnectedCommandHandler implements ICommandHandler<UserConnectedCommand> {
  constructor(
    @Inject(USER_CONNECTION_DI_TOKEN.REPOSITORY)
    private readonly repository: IUserConnectionsRepository,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(userConnectedCommand: UserConnectedCommand): Promise<void> {
    const userConnection = await this.repository.findByUserId(
      userConnectedCommand.userId,
    );

    if (userConnection) {
      await this.repository.save({
        ...userConnection,
        status: StatusEnum.ACTIVE,
        deviceToken: userConnectedCommand.deviceToken,
        platform: userConnectedCommand.platform,
        lastOnlineAt: new Date(),
      });

      return;
    }

    await this.repository.save(
      UserConnection.create({
        userId: userConnectedCommand.userId,
        email: userConnectedCommand.email,
        status: StatusEnum.ACTIVE,
        deviceToken: userConnectedCommand.deviceToken,
        project: userConnectedCommand.project,
        platform: userConnectedCommand.platform,
        lastOnlineAt: new Date(),
      }),
    );

    await this.commandBus.execute(
      new SubscriptionCreateByUserIdCommand(
        userConnectedCommand.userId,
        userConnectedCommand.project,
      ),
    );
  }
}
