import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { generateUuid } from 'src/utils/uuid.utils';
import { EventInvalidException } from '../exceptions/event-not-valid.exception';
import { BaseEntity } from 'src/shared/domain/entities/base.entity';
import { ChannelEnum } from '../value-objects/channel.vo';
import { ProjectsEnums } from '../value-objects/projects.vo';

export class Event extends BaseEntity {
  private constructor(
    readonly code: string,
    readonly name: string,
    readonly project: ProjectsEnums,
    readonly description: string | null,
    readonly channel: ChannelEnum,
    readonly title: string,
    readonly content: string,
    readonly params: string[],
    readonly autoSubscribe: boolean,
    id: Uuid,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    props: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: Uuid;
    },
  ): Event {
    if (!props.code || !props.name)
      throw new EventInvalidException(
        'Code and Name are required to create a notification event.',
      );

    return {
      ...props,
      id: props.id ?? generateUuid(),
      code: props.code.trim().toUpperCase(),
      name: props.name.trim(),
      description: props.description?.trim() ?? null,
      project: props.project,
      autoSubscribe: props.autoSubscribe,
      channel: props.channel,
      params: props.params,
      title: props.title,
      content: props.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
