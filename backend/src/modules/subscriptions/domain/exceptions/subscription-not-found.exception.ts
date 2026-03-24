import { BaseException } from 'src/shared/domain/exceptions/base.exception';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class SubscriptionNotFoundException extends BaseException {
  constructor(subscriptionId: Uuid) {
    super(`Subscription with ID ${subscriptionId} not found.`, 404);
  }
}
