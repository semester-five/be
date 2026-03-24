import { ICommand } from '@nestjs/cqrs';
import { Condition } from 'src/modules/subscriptions/domain/value-objects/condition.vo';
import { Target } from 'src/modules/subscriptions/domain/value-objects/target.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class SubscriptionUpdateByUserIdCommand implements ICommand {
  constructor(
    public readonly userId: Uuid,
    public readonly subscriptionId: Uuid,
    public readonly target: Target,
    public readonly condition: Condition,
    public readonly enabled: boolean,
  ) {}
}
