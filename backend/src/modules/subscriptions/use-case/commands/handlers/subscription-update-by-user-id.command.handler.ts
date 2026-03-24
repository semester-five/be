import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionUpdateByUserIdCommand } from '../implements/subscription-update-by-user-id.command';
import { Inject } from '@nestjs/common';
import { ISubscriptionRepository } from 'src/modules/subscriptions/domain/repositories/subscription.repository';
import { SubscriptionNotFoundException } from 'src/modules/subscriptions/domain/exceptions/subscription-not-found.exception';
import { SubscriptionInvalidUserIdException } from 'src/modules/subscriptions/domain/exceptions/subscription-invalid-user-id.exception';
import { SUBSCRIPTION_DI_TOKEN } from 'src/modules/subscriptions/subscription.di-token';

@CommandHandler(SubscriptionUpdateByUserIdCommand)
export class SubscriptionUpdateByUserIdCommandHandler implements ICommandHandler<SubscriptionUpdateByUserIdCommand> {
  constructor(
    @Inject(SUBSCRIPTION_DI_TOKEN.REPOSITORY)
    private readonly repository: ISubscriptionRepository,
  ) {}

  async execute(command: SubscriptionUpdateByUserIdCommand): Promise<void> {
    const subscription = await this.repository.findById(command.subscriptionId);

    if (!subscription) {
      throw new SubscriptionNotFoundException(command.subscriptionId);
    }

    if (subscription.user.id !== command.userId) {
      throw new SubscriptionInvalidUserIdException(
        command.subscriptionId,
        command.userId,
      );
    }

    await this.repository.save({
      ...subscription,
      target: command.target,
      condition: command.condition,
      enabled: command.enabled,
    });
  }
}
