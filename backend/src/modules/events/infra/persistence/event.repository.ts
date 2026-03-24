import { Injectable } from '@nestjs/common';
import { Event } from 'src/modules/events/domain/entities/event';
import { IEventRepository } from 'src/modules/events/domain/repositories/event.repository';
import { Repository } from 'typeorm';
import { EventEntity } from './event.entity';
import { EventMapper } from '../mappers/event.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { ProjectsEnums } from 'src/modules/events/domain/value-objects/projects.vo';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}
  async save(event: Event): Promise<void> {
    await this.eventRepository.save(EventMapper.toEntity(event));
  }

  async findByCode(code: string): Promise<Event | null> {
    return await this.eventRepository.findOneBy({ code });
  }

  async deleteByCode(code: string): Promise<void> {
    await this.eventRepository.delete({ code });
  }

  async findAll(): Promise<Event[]> {
    return EventMapper.toDomains(await this.eventRepository.find());
  }

  async findById(id: Uuid): Promise<Event | null> {
    return await this.eventRepository.findOneBy({ id });
  }

  async delete(id: Uuid): Promise<void> {
    await this.eventRepository.delete({ id });
  }

  async findAutoSubscribedEventsByProject(
    project: ProjectsEnums,
  ): Promise<Event[]> {
    return EventMapper.toDomains(
      await this.eventRepository.findBy({ autoSubscribe: true, project }),
    );
  }
}
