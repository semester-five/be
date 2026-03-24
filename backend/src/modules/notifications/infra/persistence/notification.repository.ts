import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { INotificationRepository } from 'src/modules/notifications/domain/repositories/notification.repository';
import { NotificationEntity } from './notification.entity';
import { In, Repository } from 'typeorm';
import { Notification } from 'src/modules/notifications/domain/entities/notification';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { NotificationMapper } from '../mappers/notification.mapper';
import { ChannelEnum } from 'src/modules/events/domain/value-objects/channel.vo';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}
  async saves(notifications: Notification[]): Promise<void> {
    await this.notificationRepository.save(
      NotificationMapper.toEntities(notifications),
    );
  }

  async findAllByUserIdAndChannels(
    userId: Uuid,
    channels: ChannelEnum[],
  ): Promise<Notification[]> {
    return NotificationMapper.toDomains(
      await this.notificationRepository.find({
        where: {
          userId,
          subscription: { event: { channel: In(channels) } },
        },
        order: { createdAt: 'DESC' },
      }),
    );
  }

  async countByUserIdAndChannels(
    userId: Uuid,
    channels: ChannelEnum[],
  ): Promise<number> {
    return await this.notificationRepository.countBy({
      userId,
      subscription: { event: { channel: In(channels) } },
    });
  }

  async save(entity: Notification): Promise<void> {
    await this.notificationRepository.save(NotificationMapper.toEntity(entity));
  }

  findAll(): Promise<Notification[]> {
    throw new Error('Method not implemented.');
  }

  async findById(id: Uuid): Promise<Notification | null> {
    return NotificationMapper.toDomainOrNull(
      await this.notificationRepository.findOneBy({ id }),
    );
  }

  async delete(id: Uuid): Promise<void> {
    await this.notificationRepository.delete({ id });
  }
}
