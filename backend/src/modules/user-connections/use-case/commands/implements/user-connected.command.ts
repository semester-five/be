import { ICommand } from '@nestjs/cqrs';
import { ProjectsEnums } from 'src/modules/events/domain/value-objects/projects.vo';
import { PlatformEnum } from 'src/modules/user-connections/domain/value-objects/platform.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class UserConnectedCommand implements ICommand {
  constructor(
    public readonly userId: Uuid,
    public readonly email: string,
    public readonly deviceToken: string | null,
    public readonly platform: PlatformEnum,
    public readonly project: ProjectsEnums,
  ) {}
}
