import { ApiProperty } from '@nestjs/swagger';
import { Notification } from 'src/modules/notifications/domain/entities/notification';
import { DetailMessageVO } from 'src/modules/notifications/domain/value-objects/detail-message.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import _ from 'lodash';

export class NotificationGetByUserIdResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: Uuid;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({
    example: {
      title: 'Event Title',
      content: 'Event content goes here.',
      imageUrl: 'https://example.com/image.png',
      actionUrl: 'https://example.com/action',
    },
  })
  message: DetailMessageVO;

  @ApiProperty({ example: '2026-01-13T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-13T10:00:00Z' })
  updatedAt: Date;

  static fromDomain(
    notification: Notification,
  ): NotificationGetByUserIdResponseDto {
    return {
      id: notification.id,
      isRead: notification.isRead,
      message: notification.message,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }

  static fromDomains(
    notifications: Notification[],
  ): NotificationGetByUserIdResponseDto[] {
    return _.map(notifications, (notification) =>
      this.fromDomain(notification),
    );
  }
}
