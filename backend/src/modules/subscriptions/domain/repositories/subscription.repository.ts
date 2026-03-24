import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { Subscription } from '../entities/subscription';
import { BaseRepository } from 'src/shared/domain/repositories/base.repository';

export interface ISubscriptionRepository extends BaseRepository<Subscription> {
  saves(subscriptions: Subscription[]): Promise<void>;

  findByUserId(userId: Uuid): Promise<Subscription[]>;

  findByUserIdAndEventCode(
    userId: Uuid,
    eventCode: string,
  ): Promise<Subscription[]>;
}
