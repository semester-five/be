import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionCreateByUserIdCommand } from '../implements/subscription-create-by-user-id.command';
import { Inject } from '@nestjs/common';
import { ISubscriptionRepository } from 'src/modules/subscriptions/domain/repositories/subscription.repository';
import { IEventRepository } from 'src/modules/events/domain/repositories/event.repository';
import { Subscription } from 'src/modules/subscriptions/domain/entities/subscription';
import { Target } from 'src/modules/subscriptions/domain/value-objects/target.vo';
import { SUBSCRIPTION_DI_TOKEN } from 'src/modules/subscriptions/subscription.di-token';
import { EVENT_DI_TOKEN } from 'src/modules/events/events.di-token';
import { USER_CONNECTION_DI_TOKEN } from 'src/modules/user-connections/user-connection.di-token';
import { IUserConnectionsRepository } from 'src/modules/user-connections/domain/repositories/user-connection.repository';
import { UserConnectionNotFoundException } from 'src/modules/user-connections/domain/exceptions/user-connection-not-found.exception';

@CommandHandler(SubscriptionCreateByUserIdCommand)
export class SubscriptionCreateByUserIdCommandHandler implements ICommandHandler<SubscriptionCreateByUserIdCommand> {
  constructor(
    @Inject(SUBSCRIPTION_DI_TOKEN.REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(EVENT_DI_TOKEN.REPOSITORY)
    private readonly eventRepository: IEventRepository,
    @Inject(USER_CONNECTION_DI_TOKEN.REPOSITORY)
    private readonly userConnectionRepository: IUserConnectionsRepository,
  ) {}

  async execute(command: SubscriptionCreateByUserIdCommand): Promise<void> {
    const events = await this.eventRepository.findAutoSubscribedEventsByProject(
      command.project,
    );

    const userConnections = await this.userConnectionRepository.findByUserId(
      command.userId,
    );

    if (!userConnections) {
      throw new UserConnectionNotFoundException(command.userId);
    }

    const existingSubscriptions =
      await this.subscriptionRepository.findByUserId(command.userId);

    const existingEventCodes = new Set(
      existingSubscriptions.map((subscription) => subscription.event.code),
    );

    const eventsToSubscribe = events.filter(
      (event) => !existingEventCodes.has(event.code),
    );

    if (!eventsToSubscribe.length) {
      return;
    }

    await this.subscriptionRepository.saves(
      eventsToSubscribe.map((event) => {
        return Subscription.create({
          user: userConnections,
          event,
          target: Target.ALL,
          condition: {
            rules: [],
          },
          enabled: true,
        });
      }),
    );
  }
}
