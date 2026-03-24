import { Notification } from 'src/modules/notifications/domain/entities/notification';
import { NotificationEntity } from '../persistence/notification.entity';
import _ from 'lodash';
import { SubscriptionMapper } from 'src/modules/subscriptions/infra/mappers/subscription.mapper';

export class NotificationMapper {
  static toDomainOrNull(
    entity: NotificationEntity | null,
  ): Notification | null {
    if (!entity) {
      return null;
    }

    return this.toDomain(entity);
  }

  static toDomain(entity: NotificationEntity): Notification {
    return {
      id: entity.id,
      userId: entity.userId,
      subscription: SubscriptionMapper.toDomain(entity.subscription),
      params: entity.params,
      status: entity.status,
      isRead: entity.isRead,
      message: entity.message,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDomains(entities: NotificationEntity[]): Notification[] {
    return _.map(entities, (entity) => this.toDomain(entity));
  }

  static toEntity(domain: Notification): NotificationEntity {
    return {
      id: domain.id,
      userId: domain.userId,
      subscriptionId: domain.subscription.id,
      subscription: SubscriptionMapper.toEntity(domain.subscription),
      params: domain.params,
      status: domain.status,
      isRead: domain.isRead,
      message: domain.message,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  static toEntities(domains: Notification[]): NotificationEntity[] {
    return _.map(domains, (domain) => this.toEntity(domain));
  }
}
