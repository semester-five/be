import { AbstractEntity } from 'src/shared/infra/typeorm/persistence/type-orm.abstract.entity';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { EventEntity } from 'src/modules/events/infra/persistence/event.entity';
import { Condition } from '../../domain/value-objects/condition.vo';
import { Target } from '../../domain/value-objects/target.vo';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { UserConnectionEntity } from 'src/modules/user-connections/infra/persistence/user-connection.entity';

@Entity('subscriptions')
@Index(['userId', 'eventCode'], { unique: true })
export class SubscriptionEntity extends AbstractEntity {
  @Column()
  userId: Uuid;

  @ManyToOne(() => UserConnectionEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user: UserConnectionEntity;

  @Column()
  eventCode: string;

  @ManyToOne(() => EventEntity)
  @JoinColumn({ name: 'event_code', referencedColumnName: 'code' })
  event: EventEntity;

  @Column()
  target: Target;

  @Column('jsonb')
  condition: Condition | null;

  @Column()
  enabled: boolean;
}
