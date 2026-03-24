import { AbstractEntity } from 'src/shared/infra/typeorm/persistence/type-orm.abstract.entity';
import { Column, Entity, Index } from 'typeorm';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { PlatformEnum } from '../../domain/value-objects/platform.vo';
import { StatusEnum } from '../../domain/value-objects/status.vo';
import { ProjectsEnums } from 'src/modules/events/domain/value-objects/projects.vo';

@Entity('user_connections')
export class UserConnectionEntity extends AbstractEntity {
  @Column({ unique: true })
  @Index()
  userId: Uuid;

  @Column()
  email: string;

  @Column()
  lastOnlineAt: Date;

  @Column()
  project: ProjectsEnums;

  @Column()
  platform: PlatformEnum;

  @Column()
  status: StatusEnum;
}
