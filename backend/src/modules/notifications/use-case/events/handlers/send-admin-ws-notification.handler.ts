import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotificationCreatedEvent } from '../implements/notification-created.event';
import { NotificationsGateway } from 'src/modules/notifications/presentation/gateways/notification.gateway';

@EventsHandler(NotificationCreatedEvent)
export class SendAdminWebSocketNotificationHandler implements IEventHandler<NotificationCreatedEvent> {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  handle(event: NotificationCreatedEvent): void {
    const { notification } = event;

    this.notificationsGateway.sendToUser(
      notification.userId,
      'notification:created',
      {
        id: notification.id,
        title: notification.message.title,
        content: notification.message.content,
        actionUrl: notification.message.actionUrl,
        imageUrl: notification.message.imageUrl,
        createdAt: notification.createdAt,
      },
    );
  }
}
