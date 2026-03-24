import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { Target } from '../value-objects/target.vo';
import { Condition } from '../value-objects/condition.vo';
import { generateUuid } from 'src/utils/uuid.utils';
import { BaseEntity } from 'src/shared/domain/entities/base.entity';
import { Event } from 'src/modules/events/domain/entities/event';
import { UserConnection } from 'src/modules/user-connections/domain/entities/user-connection';

export class Subscription extends BaseEntity {
  private constructor(
    readonly user: UserConnection,
    readonly event: Event,
    readonly target: Target,
    readonly condition: Condition | null,
    readonly enabled: boolean,
    id: Uuid,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    props: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: Uuid;
    },
  ): Subscription {
    return {
      id: props.id ?? generateUuid(),
      user: props.user,
      event: props.event,
      target: props.target,
      condition: props.condition,
      enabled: props.enabled,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
