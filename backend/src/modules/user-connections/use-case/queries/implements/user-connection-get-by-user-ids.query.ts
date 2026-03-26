import { Query } from '@nestjs/cqrs';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { UserConnection } from 'src/modules/user-connections/domain/entities/user-connection';

export class UserConnectionGetByUserIdsQuery extends Query<UserConnection[]> {
  constructor(public readonly userIds: Uuid[]) {
    super();
  }
}
