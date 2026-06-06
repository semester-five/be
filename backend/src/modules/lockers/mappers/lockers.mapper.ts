import { Locker } from '../domain/lockers';
import { LockerEntity } from '../entities/lockers.entity';

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
      hasItem: locker.hasItem,
      createdAt: locker.createdAt,
      updatedAt: locker.updatedAt,
      sessions: [],
    };
  }

  static toEntities(lockers: Locker[]): LockerEntity[] {
    return lockers.map((locker) => this.toEntity(locker));
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
      hasItem: lockerEntity.hasItem,
      createdAt: lockerEntity.createdAt,
      updatedAt: lockerEntity.updatedAt,
    };
  }

  static toDomains(lockerEntities: LockerEntity[]): Locker[] {
    return lockerEntities.map((lockerEntity) => this.toDomain(lockerEntity));
  }

  static toDomainOrNull(lockerEntity: LockerEntity | null): Locker | null {
    if (!lockerEntity) {
      return null;
    }

    return this.toDomain(lockerEntity);
  }
}
