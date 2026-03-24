import { AbstractEntity } from 'src/shared/infra/typeorm/persistence/type-orm.abstract.entity';
import { ChannelEnum } from '../../domain/value-objects/channel.vo';
import { ProjectsEnums } from '../../domain/value-objects/projects.vo';
import { Column, Entity } from 'typeorm';

@Entity('events')
export class EventEntity extends AbstractEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column('varchar', { nullable: true })
  description: string | null;

  @Column()
  project: ProjectsEnums;

  @Column({ default: false })
  autoSubscribe: boolean;

  @Column({ type: 'enum', enum: ChannelEnum })
  channel: ChannelEnum;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column('text', { array: true })
  params: string[];
}
