import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { generateUuid } from 'src/utils/uuid.utils';
import { BaseEntity } from 'src/shared/domain/entities/base.entity';
import { Subscription } from 'src/modules/subscriptions/domain/entities/subscription';
import { NotificationStatus } from '../value-objects/noti-status.vo';
import { DetailMessageVO } from '../value-objects/detail-message.vo';

export class Notification extends BaseEntity {
  private constructor(
    readonly userId: Uuid,
    readonly subscription: Subscription,
    readonly params: Record<string, any>,
    readonly status: NotificationStatus,
    readonly message: DetailMessageVO,
    readonly isRead: boolean,
    id: Uuid,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    props: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'> & { id?: Uuid },
  ): Notification {
    return {
      id: props.id ?? generateUuid(),
      userId: props.userId,
      subscription: props.subscription,
      params: props.params,
      status: props.status,
      message: props.message,
      isRead: props.isRead,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
