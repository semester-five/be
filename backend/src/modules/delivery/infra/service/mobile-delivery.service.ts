import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  DeliveryResult,
  INotificationDeliveryService,
} from '../../domain/service/notification-delivery.service';
import { Notification } from '../../../notifications/domain/entities/notification';
import { ChannelEnum } from '../../../events/domain/value-objects/channel.vo';
import { IUserConnectionsRepository } from 'src/modules/user-connections/domain/repositories/user-connection.repository';
import { USER_CONNECTION_DI_TOKEN } from 'src/modules/user-connections/user-connection.di-token';
import * as admin from 'firebase-admin';

@Injectable()
export class MobileDeliveryService implements INotificationDeliveryService {
  private readonly logger = new Logger(MobileDeliveryService.name);
  private readonly messagingEnabled: boolean;

  constructor(
    @Inject(USER_CONNECTION_DI_TOKEN.REPOSITORY)
    private readonly userConnectionRepository: IUserConnectionsRepository,
  ) {
    this.messagingEnabled = this.initializeFirebaseApp();
  }

  canHandle(channel: ChannelEnum): boolean {
    return channel === ChannelEnum.MOBILE;
  }

  async send(notification: Notification): Promise<DeliveryResult> {
    const startTime = Date.now();

    const mobileConnections =
      await this.userConnectionRepository.findActiveMobileConnectionsByUserId(
        notification.userId,
      );

    const tokens = Array.from(
      new Set(
        mobileConnections
          .map((connection) => connection.deviceToken)
          .filter((token): token is string => Boolean(token)),
      ),
    );

    if (!tokens.length) {
      return {
        success: false,
        channel: ChannelEnum.MOBILE,
        error: 'No active mobile device tokens found',
        metadata: {
          duration: Date.now() - startTime,
          tokenCount: 0,
        },
      };
    }

    if (!this.messagingEnabled) {
      this.logger.warn(
        'Firebase messaging is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.',
      );

      return {
        success: false,
        channel: ChannelEnum.MOBILE,
        error: 'Firebase messaging is not configured',
        metadata: {
          duration: Date.now() - startTime,
          tokenCount: tokens.length,
        },
      };
    }

    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: {
          title: notification.message.title,
          body: notification.message.content,
        },
        data: {
          notificationId: notification.id,
          actionUrl: notification.message.actionUrl ?? '',
          imageUrl: notification.message.imageUrl ?? '',
        },
      });

      const failedTokens = response.responses
        .map((result, index) => ({ result, index }))
        .filter((item) => !item.result.success)
        .map((item) => tokens[item.index]);

      if (failedTokens.length) {
        this.logger.warn(
          `Failed to deliver ${failedTokens.length} mobile notifications for ${notification.id}`,
        );
      }

      return {
        success: response.successCount > 0,
        channel: ChannelEnum.MOBILE,
        deliveredAt: response.successCount > 0 ? new Date() : undefined,
        error:
          response.successCount > 0
            ? undefined
            : 'Unable to deliver push notification to all device tokens',
        metadata: {
          duration: Date.now() - startTime,
          tokenCount: tokens.length,
          successCount: response.successCount,
          failureCount: response.failureCount,
        },
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Failed to send mobile notification ${notification.id}: ${errorMessage}`,
        errorStack,
      );

      return {
        success: false,
        channel: ChannelEnum.MOBILE,
        error: errorMessage,
        metadata: {
          duration: Date.now() - startTime,
          tokenCount: tokens.length,
        },
      };
    }
  }

  private initializeFirebaseApp(): boolean {
    if (admin.apps.length > 0) {
      return true;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      return false;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    return true;
  }
}
