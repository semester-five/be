import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { LockerEntity } from 'src/modules/lockers/entities/lockers.entity';
import { Locker } from 'src/modules/lockers/domain/lockers';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { LockersMapper } from 'src/modules/lockers/mappers/lockers.mapper';
import { LockerSizeVO } from 'src/modules/lockers/value-objects/locker-size.vo';
import { LockerStatusVO } from 'src/modules/lockers/value-objects/locker-status.vo';
import { DoorStateVO } from 'src/modules/lockers/value-objects/door-state.vo';

export const CABINET_1_ID = '11111111-1111-1111-1111-111111111111' as Uuid;
export const CABINET_2_ID = '22222222-2222-2222-2222-222222222222' as Uuid;

export class LockerSeeds implements Seeder {
  private readonly lockers: Locker[] = [
    Locker.create({
      id: CABINET_1_ID,
      code: 'CABINET-01',
      location: 'Main Building - Ground Floor',
      size: LockerSizeVO.MEDIUM,
      openUrl: 'mqtt://cabinet-01/open',
      closeUrl: 'mqtt://cabinet-01/close',
      status: LockerStatusVO.AVAILABLE,
      doorState: DoorStateVO.CLOSED,
      hasItem: false,
    }),
    Locker.create({
      id: CABINET_2_ID,
      code: 'CABINET-02',
      location: 'Main Building - Ground Floor',
      size: LockerSizeVO.MEDIUM,
      openUrl: 'mqtt://cabinet-02/open',
      closeUrl: 'mqtt://cabinet-02/close',
      status: LockerStatusVO.AVAILABLE,
      doorState: DoorStateVO.CLOSED,
      hasItem: false,
    }),
  ];

  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(LockerEntity);
    await repository.save(LockersMapper.toEntities(this.lockers));
  }
}
