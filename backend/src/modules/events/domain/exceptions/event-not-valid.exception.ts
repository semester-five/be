import { BaseException } from 'src/shared/domain/exceptions/base.exception';

export class EventInvalidException extends BaseException {
  constructor(message: string) {
    super(`Event is not valid: ${message}`, 400);
    this.name = 'EventInvalidException';
  }
}
