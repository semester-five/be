import { BaseEntity } from 'src/shared/domain/entities/base.entity';
import { SessionStatusVO } from '../value-objects/session-status.vo';
import { AuthMethodVO } from '../value-objects/auth-method.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { generateUuid } from 'src/utils/uuid.utils';
import { Locker } from 'src/modules/lockers/domain/lockers';

export class Session extends BaseEntity {
  constructor(
    public readonly userId: Uuid | null,
    public readonly lockerId: Uuid,
    public readonly locker: Locker,
    public readonly checkInAt: Date,
    public checkOutAt: Date | null,
    public status: SessionStatusVO,
    public readonly authMethod: AuthMethodVO,
    public readonly guestFaceVector: number[] | null,
    public readonly qrTokenId: Uuid | null,
    public readonly age: number | null,
    public readonly gender: string | null,
    id: Uuid,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    props: Omit<Session, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: Uuid;
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): Session {
    return {
      ...props,
      id: props.id ?? generateUuid(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    } as Session;
  }
}
