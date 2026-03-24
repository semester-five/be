import { BaseException } from '../../../../shared/domain/exceptions/base.exception';

export class DeliveryFailedException extends BaseException {
  constructor(channel: string, reason: string) {
    super(`Delivery failed for channel ${channel}: ${reason}`);
    this.name = 'DeliveryFailedException';
  }
}
