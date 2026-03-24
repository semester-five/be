import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SubscriptionsGetByUserIdQuery } from '../implements/subscriptions-get-by-user-id.query';
import { Inject } from '@nestjs/common';
import { ISubscriptionRepository } from 'src/modules/subscriptions/domain/repositories/subscription.repository';
import { Subscription } from 'src/modules/subscriptions/domain/entities/subscription';
import { SUBSCRIPTION_DI_TOKEN } from 'src/modules/subscriptions/subscription.di-token';

@QueryHandler(SubscriptionsGetByUserIdQuery)
export class SubscriptionsGetByUserIdQueryHandler implements IQueryHandler<SubscriptionsGetByUserIdQuery> {
  constructor(
    @Inject(SUBSCRIPTION_DI_TOKEN.REPOSITORY)
    private readonly repository: ISubscriptionRepository,
  ) {}

  async execute(query: SubscriptionsGetByUserIdQuery): Promise<Subscription[]> {
    return this.repository.findByUserId(query.userId);
  }
}
