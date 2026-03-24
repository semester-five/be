import { Module } from '@nestjs/common';
import { NotificationDeliveryFactory } from './infra/service/notification-delivery.factory';
@Module({
  providers: [NotificationDeliveryFactory],
  exports: [NotificationDeliveryFactory],
})
export class DeliveryModule {}
