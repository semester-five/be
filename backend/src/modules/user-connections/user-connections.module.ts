import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConnectionEntity } from './infra/persistence/user-connection.entity';
import { USER_CONNECTION_DI_TOKEN } from './user-connection.di-token';
import { UserConnectionRepository } from './infra/persistence/user-connection.repository';
import { UserConnectionEventListener } from './presentation/controllers/user-connection.event-listener';
import { UserConnectedCommandHandler } from './use-case/commands/handlers/user-connected.command.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { UserDisconnectedCommandHandler } from './use-case/commands/handlers/user-disconnected.command.handler';
import { UserConnectionGetByUserIdsQueryHandler } from './use-case/queries/handlers/user-connection-get-by-ids.query.handler';

const commandHandlers = [
  UserConnectedCommandHandler,
  UserDisconnectedCommandHandler,
];
const queryHandlers = [UserConnectionGetByUserIdsQueryHandler];

@Module({
  imports: [TypeOrmModule.forFeature([UserConnectionEntity]), CqrsModule],
  providers: [
    {
      provide: USER_CONNECTION_DI_TOKEN.REPOSITORY,
      useClass: UserConnectionRepository,
    },
    UserConnectionEventListener,
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: [USER_CONNECTION_DI_TOKEN.REPOSITORY],
})
export class UserConnectionsModule {}
