import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { SubscriptionEntity } from 'src/modules/subscriptions/infra/persistence/subscription.entity';
import { NotificationStatus } from '../../domain/value-objects/noti-status.vo';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { DetailMessageVO } from '../../domain/value-objects/detail-message.vo';
import { AbstractEntity } from 'src/shared/infra/typeorm/persistence/type-orm.abstract.entity';

@Entity('notifications')
@Index(['userId', 'subscriptionId'])
export class NotificationEntity extends AbstractEntity {
  @Column()
  userId: Uuid;

  @Column()
  subscriptionId: Uuid;

  @ManyToOne(() => SubscriptionEntity)
  subscription: SubscriptionEntity;

  @Column({ type: 'jsonb' })
  params: Record<string, any>;

  @Column()
  status: NotificationStatus;

  @Column('jsonb')
  message: DetailMessageVO;

  @Column({ default: false })
  isRead: boolean;
}
