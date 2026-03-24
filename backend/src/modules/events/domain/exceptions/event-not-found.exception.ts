import { BaseException } from 'src/shared/domain/exceptions/base.exception';

export class EventNotFoundException extends BaseException {
  constructor(eventCode: string) {
    super(`Event with code '${eventCode}' not found.`, 404);
    this.name = 'EventNotFoundException';
  }
}
