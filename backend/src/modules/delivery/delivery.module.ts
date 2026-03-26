import { Module } from '@nestjs/common';
import { NotificationDeliveryFactory } from './infra/service/notification-delivery.factory';
import { MobileDeliveryService } from './infra/service/mobile-delivery.service';
import { UserConnectionsModule } from '../user-connections/user-connections.module';

@Module({
  imports: [UserConnectionsModule],
  providers: [NotificationDeliveryFactory, MobileDeliveryService],
  exports: [NotificationDeliveryFactory],
})
export class DeliveryModule {}
