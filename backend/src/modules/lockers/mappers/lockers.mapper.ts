import { Locker } from '../domain/lockers';
import { LockerEntity } from '../entities/lockers.entity';
import { map } from 'lodash';

export class LockersMapper {
  static toEntity(locker: Locker): LockerEntity {
    return {
      id: locker.id,
      code: locker.code,
      location: locker.location,
      size: locker.size,
      openUrl: locker.openUrl,
      closeUrl: locker.closeUrl,
      status: locker.status,
      doorState: locker.doorState,
      createdAt: locker.createdAt,
      updatedAt: locker.updatedAt,
      sessions: [],
    };
  }

  static toEntities(lockers: Locker[]): LockerEntity[] {
    return map(lockers, this.toEntity.bind(this)) as LockerEntity[];
  }

  static toDomain(lockerEntity: LockerEntity): Locker {
    return {
      id: lockerEntity.id,
      code: lockerEntity.code,
      location: lockerEntity.location,
      size: lockerEntity.size,
      openUrl: lockerEntity.openUrl,
      closeUrl: lockerEntity.closeUrl,
      status: lockerEntity.status,
      doorState: lockerEntity.doorState,
      createdAt: lockerEntity.createdAt,
      updatedAt: lockerEntity.updatedAt,
    };
  }

  static toDomains(lockerEntities: LockerEntity[]): Locker[] {
    return map(lockerEntities, this.toDomain.bind(this)) as Locker[];
  }

  static toDomainOrNull(lockerEntity: LockerEntity | null): Locker | null {
    if (!lockerEntity) {
      return null;
    }

    return this.toDomain(lockerEntity);
  }
}
