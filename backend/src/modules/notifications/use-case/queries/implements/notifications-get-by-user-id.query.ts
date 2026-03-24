import { IQuery } from '@nestjs/cqrs';
import { ChannelEnum } from 'src/modules/events/domain/value-objects/channel.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class NotificationsGetByUserIdQuery implements IQuery {
  constructor(
    public readonly userId: Uuid,
    public readonly channels: ChannelEnum[] | undefined,
  ) {}
}
