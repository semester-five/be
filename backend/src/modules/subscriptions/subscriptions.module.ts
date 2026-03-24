import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from './infra/persistence/subscription.entity';
import { SubscriptionRepository } from './infra/persistence/subscription.repository';
import { SubscriptionCreateByUserIdCommandHandler } from './use-case/commands/handlers/subscription-create-by-user-id.command.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { EventsModule } from 'src/modules/events/events.module';
import { SUBSCRIPTION_DI_TOKEN } from './subscription.di-token';
import { UserConnectionsModule } from 'src/modules/user-connections/user-connections.module';

const commandHandlers: Provider[] = [SubscriptionCreateByUserIdCommandHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    CqrsModule,
    EventsModule,
    UserConnectionsModule,
  ],
  providers: [
    {
      provide: SUBSCRIPTION_DI_TOKEN.REPOSITORY,
      useClass: SubscriptionRepository,
    },
    ...commandHandlers,
  ],
  exports: [SUBSCRIPTION_DI_TOKEN.REPOSITORY],
})
export class SubscriptionsModule {}
