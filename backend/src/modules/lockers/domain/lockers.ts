import { BaseEntity } from 'src/shared/domain/entities/base.entity';
import { LockerSizeVO } from '../value-objects/locker-size.vo';
import { LockerStatusVO } from '../value-objects/locker-status.vo';
import { DoorStateVO } from '../value-objects/door-state.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { generateUuid } from 'src/utils/uuid.utils';

export class Locker extends BaseEntity {
  constructor(
    public readonly code: string,
    public readonly location: string,
    public readonly size: LockerSizeVO,
    public readonly openUrl: string,
    public readonly closeUrl: string,
    public readonly status: LockerStatusVO,
    public readonly doorState: DoorStateVO,
    id: Uuid,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    props: Omit<Locker, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: Uuid;
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): Locker {
    return {
      ...props,
      id: props.id ?? generateUuid(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }
}
