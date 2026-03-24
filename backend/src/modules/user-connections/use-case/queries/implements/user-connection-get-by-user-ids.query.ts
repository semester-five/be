import { IQuery } from '@nestjs/cqrs';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class UserConnectionGetByUserIdsQuery implements IQuery {
  constructor(public readonly userIds: Uuid[]) {}
}
