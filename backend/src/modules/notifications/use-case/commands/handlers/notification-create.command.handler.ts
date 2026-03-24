import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { NotificationCreateCommand } from '../implements/notification-create.command';
import { Inject } from '@nestjs/common';
import { ISubscriptionRepository } from 'src/modules/subscriptions/domain/repositories/subscription.repository';
import { INotificationRepository } from 'src/modules/notifications/domain/repositories/notification.repository';
import _ from 'lodash';
import { Notification } from 'src/modules/notifications/domain/entities/notification';
import { NotificationStatus } from 'src/modules/notifications/domain/value-objects/noti-status.vo';
import { NOTIFICATION_DI_TOKEN } from 'src/modules/notifications/notification.di-token';
import { SUBSCRIPTION_DI_TOKEN } from 'src/modules/subscriptions/subscription.di-token';
import { EVENT_DI_TOKEN } from 'src/modules/events/events.di-token';
import { IRenderContentService } from 'src/modules/events/domain/service/render-content.service';
import { NotificationCreatedEvent } from '../../events/implements/notification-created.event';
import { DetailMessageVO } from 'src/modules/notifications/domain/value-objects/detail-message.vo';

@CommandHandler(NotificationCreateCommand)
export class NotificationCreateCommandHandler implements ICommandHandler<NotificationCreateCommand> {
  constructor(
    @Inject(SUBSCRIPTION_DI_TOKEN.REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(NOTIFICATION_DI_TOKEN.REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
    @Inject(EVENT_DI_TOKEN.RENDER_CONTENT_SERVICE)
    private readonly renderContentService: IRenderContentService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: NotificationCreateCommand): Promise<void> {
    const imageUrl = this.getOptionalString(command.params, 'imageUrl');
    const actionUrl = this.getOptionalString(command.params, 'actionUrl');

    const subscriptions =
      await this.subscriptionRepository.findByUserIdAndEventCode(
        command.userId,
        command.eventCode,
      );

    const notifications = _.map(subscriptions, (subscription) =>
      Notification.create({
        userId: command.userId,
        subscription,
        params: command.params,
        status: NotificationStatus.PENDING,
        message: DetailMessageVO.create({
          title: this.renderContentService.render(
            subscription.event.title,
            command.params,
          ),
          content: this.renderContentService.render(
            subscription.event.content,
            command.params,
          ),
          imageUrl,
          actionUrl,
        }),
        isRead: false,
      }),
    );

    await this.notificationRepository.saves(notifications);

    notifications.forEach((notification) => {
      this.eventBus.publish(new NotificationCreatedEvent(notification));
    });
  }

  private getOptionalString(
    params: Record<string, unknown>,
    key: string,
  ): string | undefined {
    const value = params[key];
    return typeof value === 'string' ? value : undefined;
  }
}
