import { ChannelEnum } from 'src/modules/events/domain/value-objects/channel.vo';
import { NotificationsGetByUserIdQuery } from 'src/modules/notifications/use-case/queries/implements/notifications-get-by-user-id.query';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class NotificationPrensenterMapper {
  static toNotificationGetByUserIdQuery(
    userId: Uuid,
    channels: ChannelEnum[] | undefined,
  ): NotificationsGetByUserIdQuery {
    return new NotificationsGetByUserIdQuery(userId, channels);
  }
}
