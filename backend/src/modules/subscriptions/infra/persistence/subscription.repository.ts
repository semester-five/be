import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { Subscription } from 'src/modules/subscriptions/domain/entities/subscription';
import { ISubscriptionRepository } from 'src/modules/subscriptions/domain/repositories/subscription.repository';
import { SubscriptionEntity } from './subscription.entity';
import { Repository } from 'typeorm';
import { SubscriptionMapper } from '../mappers/subscription.mapper';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepo: Repository<SubscriptionEntity>,
  ) {}
  async findByUserIdAndEventCode(
    userId: Uuid,
    eventCode: string,
  ): Promise<Subscription[]> {
    return SubscriptionMapper.toDomains(
      await this.subscriptionRepo.find({
        where: { userId, eventCode },
        relations: {
          event: true,
          user: true,
        },
      }),
    );
  }

  async saves(subscriptions: Subscription[]): Promise<void> {
    await this.subscriptionRepo.save(
      SubscriptionMapper.toEntities(subscriptions),
    );
  }

  async save(notificationSubsciption: Subscription): Promise<void> {
    await this.subscriptionRepo.save(
      SubscriptionMapper.toEntity(notificationSubsciption),
    );
  }

  async findById(id: Uuid): Promise<Subscription | null> {
    return this.subscriptionRepo.findOneBy({ id });
  }

  async findByUserId(userId: Uuid): Promise<Subscription[]> {
    return SubscriptionMapper.toDomains(
      await this.subscriptionRepo.findBy({ userId }),
    );
  }
  async delete(id: Uuid): Promise<void> {
    await this.subscriptionRepo.delete(id);
  }

  async findAll(): Promise<Subscription[]> {
    return SubscriptionMapper.toDomains(await this.subscriptionRepo.find());
  }
}
