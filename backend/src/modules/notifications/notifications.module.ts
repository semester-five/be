import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationEntity } from './infra/persistence/notification.entity';
import { NotificationRepository } from './infra/persistence/notification.repository';
import { NotificationCreateCommandHandler } from './use-case/commands/handlers/notification-create.command.handler';
import { SendNotificationHandler } from './use-case/events/handlers/send-notification.handler';
import { SubscriptionsModule } from 'src/modules/subscriptions/subscriptions.module';
import { DeliveryModule } from 'src/modules/delivery/delivery.module';
import { NotificationController } from './presentation/controllers/notification.controller';
import { NOTIFICATION_DI_TOKEN } from './notification.di-token';
import { EventsModule } from 'src/modules/events/events.module';
import { NotificationsGetByUserIdQueryHandler } from './use-case/queries/handlers/notifications-get-by-user-id.query.handler';

const commandHandlers = [NotificationCreateCommandHandler];
const eventHandlers = [SendNotificationHandler];
const queryHandlers = [NotificationsGetByUserIdQueryHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([NotificationEntity]),
    SubscriptionsModule,
    DeliveryModule,
    EventsModule,
  ],
  controllers: [NotificationController],
  providers: [
    {
      provide: NOTIFICATION_DI_TOKEN.REPOSITORY,
      useClass: NotificationRepository,
    },
    ...commandHandlers,
    ...eventHandlers,
    ...queryHandlers,
  ],
  exports: [NOTIFICATION_DI_TOKEN.REPOSITORY],
})
export class NotificationsModule {}
