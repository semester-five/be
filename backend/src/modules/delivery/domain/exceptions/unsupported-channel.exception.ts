import { BaseException } from '../../../../shared/domain/exceptions/base.exception';

export class UnsupportedChannelException extends BaseException {
  constructor(channel: string) {
    super(`Unsupported delivery channel: ${channel}`);
    this.name = 'UnsupportedChannelException';
  }
}
