import { ICommand } from '@nestjs/cqrs';
import { ProjectsEnums } from 'src/modules/events/domain/value-objects/projects.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class SubscriptionCreateByUserIdCommand implements ICommand {
  constructor(
    public readonly userId: Uuid,
    public readonly project: ProjectsEnums,
  ) {}
}
