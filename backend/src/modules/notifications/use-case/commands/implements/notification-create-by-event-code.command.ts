import { ICommand } from '@nestjs/cqrs';

export class NotificationCreateByEventCodeCommand implements ICommand {
  constructor(
    public readonly eventCode: string,
    public readonly params: Record<string, unknown>,
  ) {}
}
