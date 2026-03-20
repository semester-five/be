import { BaseEntity } from 'src/shared/domain/entities/base.entity';
import { QRTokenActionVO } from '../value-objects/qr-token-action.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { generateUuid } from 'src/utils/uuid.utils';

export class QRToken extends BaseEntity {
  constructor(
    public readonly action: QRTokenActionVO,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly isUsed: boolean,
    public readonly userId: Uuid,
    public readonly sessionId: Uuid | null,
    id: Uuid,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    props: Omit<
      QRToken,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'markAsUsed'
      | 'checkExpired'
      | 'sessionId'
    > & {
      id?: Uuid;
      createdAt?: Date;
      updatedAt?: Date;
      sessionId?: Uuid | null;
    },
  ): QRToken {
    return {
      ...props,
      id: props.id ?? generateUuid(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      sessionId: props.sessionId ?? null,
    };
  }
}
