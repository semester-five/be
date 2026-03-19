import { BaseEntity } from 'src/shared/domain/entities/base.entity';
import { QRTokenActionVO } from '../value-objects/qr-token-action.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { generateUuid } from 'src/utils/uuid.utils';

interface MutableQRToken {
  isUsed: boolean;
  updatedAt: Date;
}

export class QRToken extends BaseEntity {
  constructor(
    public readonly action: QRTokenActionVO,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly isUsed: boolean,
    public readonly userId: Uuid | null,
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
      'id' | 'createdAt' | 'updatedAt' | 'markAsUsed' | 'checkExpired'
    > & {
      id?: Uuid;
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): QRToken {
    return {
      ...props,
      id: props.id ?? generateUuid(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    } as QRToken;
  }

  markAsUsed(): void {
    const mutable = this as unknown as MutableQRToken;
    mutable.isUsed = true;
    mutable.updatedAt = new Date();
  }

  checkExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
