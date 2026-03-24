import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotificationCreatedEvent } from '../implements/notification-created.event';
import { NotificationDeliveryFactory } from 'src/modules/delivery/infra/service/notification-delivery.factory';

@EventsHandler(NotificationCreatedEvent)
export class SendNotificationHandler implements IEventHandler<NotificationCreatedEvent> {
  constructor(private readonly deliveryFactory: NotificationDeliveryFactory) {}

  async handle(event: NotificationCreatedEvent): Promise<void> {
    await this.deliveryFactory
      .getDeliveryService(event.notification.subscription.event.channel)
      .send(event.notification);
  }
}
