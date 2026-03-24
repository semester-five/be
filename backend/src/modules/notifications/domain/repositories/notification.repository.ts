import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { Notification } from '../entities/notification';
import { BaseRepository } from 'src/shared/domain/repositories/base.repository';
import { ChannelEnum } from 'src/modules/events/domain/value-objects/channel.vo';

export interface INotificationRepository extends BaseRepository<Notification> {
  saves(notifications: Notification[]): Promise<void>;

  findAllByUserIdAndChannels(
    userId: Uuid,
    channels: ChannelEnum[] | undefined,
  ): Promise<Notification[]>;

  countByUserIdAndChannels(
    userId: Uuid,
    channels: ChannelEnum[] | undefined,
  ): Promise<number>;
}
