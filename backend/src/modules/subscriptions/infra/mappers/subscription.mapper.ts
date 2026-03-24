import _ from 'lodash';
import { Subscription } from 'src/modules/subscriptions/domain/entities/subscription';
import { SubscriptionEntity } from '../persistence/subscription.entity';
import { EventMapper } from 'src/modules/events/infra/mappers/event.mapper';

export class SubscriptionMapper {
  static toEntity(subscription: Subscription): SubscriptionEntity {
    return {
      id: subscription.id,
      userId: subscription.user.id,
      user: subscription.user,
      eventCode: subscription.event.code,
      event: EventMapper.toEntity(subscription.event),
      target: subscription.target,
      condition: subscription.condition,
      enabled: subscription.enabled,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }

  static toEntities(subscriptions: Subscription[]) {
    return _.map(subscriptions, (subscription) => this.toEntity(subscription));
  }

  static toDomain(subscriptionEntity: SubscriptionEntity): Subscription {
    return {
      id: subscriptionEntity.id,
      user: subscriptionEntity.user,
      event: EventMapper.toDomain(subscriptionEntity.event),
      target: subscriptionEntity.target,
      condition: subscriptionEntity.condition,
      enabled: subscriptionEntity.enabled,
      createdAt: subscriptionEntity.createdAt,
      updatedAt: subscriptionEntity.updatedAt,
    };
  }

  static toDomains(subscriptionEntities: SubscriptionEntity[]): Subscription[] {
    return _.map(subscriptionEntities, (subscriptionEntity) =>
      this.toDomain(subscriptionEntity),
    );
  }
}
