import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { generateUuid } from 'src/utils/uuid.utils';
import { BaseEntity } from 'src/shared/domain/entities/base.entity';
import { PlatformEnum } from '../value-objects/platform.vo';
import { StatusEnum } from '../value-objects/status.vo';
import { ProjectsEnums } from 'src/modules/events/domain/value-objects/projects.vo';

export class UserConnection extends BaseEntity {
  private constructor(
    readonly userId: Uuid,
    readonly email: string,
    readonly lastOnlineAt: Date,
    readonly project: ProjectsEnums,
    readonly platform: PlatformEnum,
    readonly status: StatusEnum,
    id: Uuid,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    props: Omit<UserConnection, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: Uuid;
    },
  ): UserConnection {
    return {
      id: props.id ?? generateUuid(),
      userId: props.userId,
      email: props.email,
      lastOnlineAt: props.lastOnlineAt,
      project: props.project,
      platform: props.platform,
      status: props.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
