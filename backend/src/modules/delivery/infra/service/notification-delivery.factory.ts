import { Injectable } from '@nestjs/common';
import { INotificationDeliveryService } from '../../domain/service/notification-delivery.service';
import { ChannelEnum } from '../../../events/domain/value-objects/channel.vo';
import { UnsupportedChannelException } from '../../domain/exceptions/unsupported-channel.exception';

@Injectable()
export class NotificationDeliveryFactory {
  private readonly deliveryServices: INotificationDeliveryService[];

  constructor() {
    this.deliveryServices = [];
  }

  getDeliveryService(channel: ChannelEnum): INotificationDeliveryService {
    const service = this.deliveryServices.find((s) => s.canHandle(channel));

    if (!service) {
      throw new UnsupportedChannelException(channel);
    }

    return service;
  }
}
