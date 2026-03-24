import { BaseException } from 'src/shared/domain/exceptions/base.exception';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class UserConnectionNotFoundException extends BaseException {
  constructor(userId: Uuid) {
    super(`User connection with ID ${userId} not found.`, 404);
  }
}
