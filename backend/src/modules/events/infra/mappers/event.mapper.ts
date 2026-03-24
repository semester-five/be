import { Event } from 'src/modules/events/domain/entities/event';
import { EventEntity } from '../persistence/event.entity';
import { ChannelEnum } from 'src/modules/events/domain/value-objects/channel.vo';
import _ from 'lodash';

export class EventMapper {
  static toEntity(event: Event): EventEntity {
    return {
      id: event.id,
      code: event.code,
      name: event.name,
      project: event.project,
      description: event.description,
      autoSubscribe: event.autoSubscribe,
      channel: event.channel,
      title: event.title,
      content: event.content,
      params: event.params,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }

  static toEntities(events: Event[]): EventEntity[] {
    return _.map(events, (event) => this.toEntity(event));
  }

  static toDomain(eventEntity: EventEntity): Event {
    return {
      id: eventEntity.id,
      code: eventEntity.code,
      name: eventEntity.name,
      description: eventEntity.description,
      project: eventEntity.project,
      params: eventEntity.params,
      autoSubscribe: eventEntity.autoSubscribe,
      channel: eventEntity.channel || ChannelEnum.WEB,
      title: eventEntity.title,
      content: eventEntity.content,
      createdAt: eventEntity.createdAt,
      updatedAt: eventEntity.updatedAt,
    };
  }

  static toDomains(eventEntities: EventEntity[]): Event[] {
    return _.map(eventEntities, (eventEntity) => this.toDomain(eventEntity));
  }
}
