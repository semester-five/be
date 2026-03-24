import { Notification } from '../../../notifications/domain/entities/notification';
import { ChannelEnum } from '../../../events/domain/value-objects/channel.vo';

export interface DeliveryResult {
  success: boolean;
  channel: ChannelEnum;
  deliveredAt?: Date;
  error?: string;
  metadata?: Record<string, any>;
}

export interface INotificationDeliveryService {
  send(notification: Notification): Promise<DeliveryResult>;
  canHandle(channel: ChannelEnum): boolean;
}
