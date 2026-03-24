import { IEvent } from '@nestjs/cqrs';
import { Notification } from 'src/modules/notifications/domain/entities/notification';

export class NotificationCreatedEvent implements IEvent {
  constructor(readonly notification: Notification) {}
}
