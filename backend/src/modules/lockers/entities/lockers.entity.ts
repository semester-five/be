import { AbstractEntity } from 'src/shared/infra/typeorm/persistence/type-orm.abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { LockerSizeVO } from '../value-objects/locker-size.vo';
import { LockerStatusVO } from '../value-objects/locker-status.vo';
import { DoorStateVO } from '../value-objects/door-state.vo';
import { SessionEntity } from 'src/modules/sessions/entities/session.entity';

@Entity('lockers')
export class LockerEntity extends AbstractEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  location: string;

  @Column({ enum: LockerSizeVO, type: 'enum' })
  size: LockerSizeVO;

  @Column({ unique: true })
  esp32Id: string;

  @Column()
  relayPin: number;

  @Column()
  sensorPin: number;

  @Column({ enum: LockerStatusVO, type: 'enum' })
  status: LockerStatusVO;

  @Column({ enum: DoorStateVO, type: 'enum' })
  doorState: DoorStateVO;

  @OneToMany(() => SessionEntity, (session) => session.locker)
  sessions: SessionEntity[];
}
