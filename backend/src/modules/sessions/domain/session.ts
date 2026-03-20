import { BaseEntity } from 'src/shared/domain/entities/base.entity';
import { SessionStatusVO } from '../value-objects/session-status.vo';
import { AuthMethodVO } from '../value-objects/auth-method.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { generateUuid } from 'src/utils/uuid.utils';
import { Locker } from 'src/modules/lockers/domain/lockers';

// interface MutableSession {
//   checkOutAt: Date | null;
//   status: SessionStatusVO;
//   updatedAt: Date;
// }

export class Session extends BaseEntity {
  constructor(
    public readonly userId: Uuid | null,
    public readonly lockerId: Uuid,
    public readonly locker: Locker,
    public readonly checkInAt: Date,
    public readonly checkOutAt: Date | null,
    public readonly status: SessionStatusVO,
    public readonly authMethod: AuthMethodVO,
    public readonly guestFaceVector: number[] | null,
    public readonly qrTokenId: Uuid | null,
    id: Uuid,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    props: Omit<
      Session,
      'id' | 'createdAt' | 'updatedAt' | 'complete' | 'cancel'
    > & {
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
    };
  }

  // complete(): void {
  //   const mutable = this as unknown as MutableSession;
  //   mutable.checkOutAt = new Date();
  //   mutable.status = SessionStatusVO.COMPLETED;
  //   mutable.updatedAt = new Date();
  // }

  // cancel(): void {
  //   const mutable = this as unknown as MutableSession;
  //   mutable.status = SessionStatusVO.CANCELLED;
  //   mutable.updatedAt = new Date();
  // }
}
