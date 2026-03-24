import { BaseException } from 'src/shared/domain/exceptions/base.exception';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class SubscriptionInvalidUserIdException extends BaseException {
  constructor(subscription: Uuid, userId: Uuid) {
    super(
      `The user ID ${userId} is not valid for subscription ${subscription}.`,
      400,
    );
  }
}
