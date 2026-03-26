import { Injectable } from '@nestjs/common';
import { INotificationDeliveryService } from '../../domain/service/notification-delivery.service';
import { ChannelEnum } from '../../../events/domain/value-objects/channel.vo';
import { UnsupportedChannelException } from '../../domain/exceptions/unsupported-channel.exception';
import { MobileDeliveryService } from './mobile-delivery.service';

@Injectable()
export class NotificationDeliveryFactory {
  private readonly deliveryServices: INotificationDeliveryService[];

  constructor(private readonly mobileDeliveryService: MobileDeliveryService) {
    this.deliveryServices = [mobileDeliveryService];
  }

  getDeliveryService(channel: ChannelEnum): INotificationDeliveryService {
    const service = this.deliveryServices.find((s) => s.canHandle(channel));

    if (!service) {
      throw new UnsupportedChannelException(channel);
    }

    return service;
  }
}
