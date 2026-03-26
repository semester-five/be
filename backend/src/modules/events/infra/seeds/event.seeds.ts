import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { EventEntity } from '../persistence/event.entity';
import { Event } from 'src/modules/events/domain/entities/event';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { EventMapper } from '../mappers/event.mapper';
import { ChannelEnum } from 'src/modules/events/domain/value-objects/channel.vo';
import { ProjectsEnums } from 'src/modules/events/domain/value-objects/projects.vo';

export class EventsSeeds implements Seeder {
  private readonly events: Event[] = [
    Event.create({
      id: '00000000-0000-0000-0000-000000000001' as Uuid,
      name: 'Locker locked over 24 hours',
      code: 'LOCKER_LOCKED_OVER_24H',
      description:
        'Event triggered when a locker has remained in use for more than 24 hours',
      project: ProjectsEnums.LOCKER,
      autoSubscribe: true,
      channel: ChannelEnum.MOBILE,
      title: 'Locker {{lockerCode}} has been occupied too long',
      content:
        'Locker {{lockerCode}} at {{location}} has been active for {{durationHours}} hours. Please review the session.',
      params: ['lockerCode', 'location', 'durationHours', 'actionUrl'],
    }),
  ];

  async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(EventEntity);

    return await repository.save(EventMapper.toEntities(this.events));
  }
}
