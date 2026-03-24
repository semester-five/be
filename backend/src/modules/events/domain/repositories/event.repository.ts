import { BaseRepository } from 'src/shared/domain/repositories/base.repository';
import { Event } from '../entities/event';
import { ProjectsEnums } from '../value-objects/projects.vo';

export interface IEventRepository extends BaseRepository<Event> {
  findAutoSubscribedEventsByProject(project: ProjectsEnums): Promise<Event[]>;

  findByCode(code: string): Promise<Event | null>;

  deleteByCode(code: string): Promise<void>;
}
