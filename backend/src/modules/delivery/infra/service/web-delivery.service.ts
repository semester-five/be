import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  DeliveryResult,
  INotificationDeliveryService,
} from '../../domain/service/notification-delivery.service';
import { Notification } from '../../../notifications/domain/entities/notification';
import { ChannelEnum } from '../../../events/domain/value-objects/channel.vo';
import { IStreamingService } from 'src/shared/domain/service/streaming.service';
import { STREAMING_DI_TOKEN } from 'src/shared/di-tokens/streaming.di-token';

@Injectable()
export class WebDeliveryService implements INotificationDeliveryService {
  private readonly logger = new Logger(WebDeliveryService.name);

  constructor(
    @Inject(STREAMING_DI_TOKEN.SERVICE)
    private readonly socketRepository: IStreamingService,
  ) {}

  canHandle(channel: ChannelEnum): boolean {
    return channel === ChannelEnum.WEB;
  }

  async send(notification: Notification): Promise<DeliveryResult> {
    const startTime = Date.now();
    try {
      await this.socketRepository.emitToUser(
        notification.userId,
        'notification',
        this.buildWebNotificationPayload(notification),
      );

      return {
        success: true,
        channel: ChannelEnum.WEB,
        deliveredAt: new Date(),
        metadata: {
          duration: Date.now() - startTime,
        },
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Failed to send web notification ${notification.id}: ${errorMessage}`,
        errorStack,
      );

      return {
        success: false,
        channel: ChannelEnum.WEB,
        error: errorMessage,
        metadata: {
          duration: Date.now() - startTime,
        },
      };
    }
  }

  private buildWebNotificationPayload(notification: Notification) {
    return {
      title: notification.message.title,
      content: notification.message.content,
      actionUrl: notification.message.actionUrl,
      imageUrl: notification.message.imageUrl,
    };
  }
}
