import { Notification } from '../entities/notification';

export interface INotificationSendService {
  send(notification: Notification): Promise<void>;
}
