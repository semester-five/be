import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotificationsGetByUserIdQuery } from '../implements/notifications-get-by-user-id.query';
import { Inject } from '@nestjs/common';
import { INotificationRepository } from 'src/modules/notifications/domain/repositories/notification.repository';
import { Notification } from 'src/modules/notifications/domain/entities/notification';
import { NOTIFICATION_DI_TOKEN } from 'src/modules/notifications/notification.di-token';

@QueryHandler(NotificationsGetByUserIdQuery)
export class NotificationsGetByUserIdQueryHandler implements IQueryHandler<NotificationsGetByUserIdQuery> {
  constructor(
    @Inject(NOTIFICATION_DI_TOKEN.REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(query: NotificationsGetByUserIdQuery): Promise<Notification[]> {
    return this.notificationRepository.findAllByUserIdAndChannels(
      query.userId,
      query.channels,
    );
  }
}
