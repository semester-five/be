import { IQuery } from '@nestjs/cqrs';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class SubscriptionsGetByUserIdQuery implements IQuery {
  constructor(public readonly userId: Uuid) {}
}
