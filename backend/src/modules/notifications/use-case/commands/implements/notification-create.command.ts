import { ICommand } from '@nestjs/cqrs';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class NotificationCreateCommand implements ICommand {
  constructor(
    public readonly userId: Uuid,
    public readonly eventCode: string,
    public readonly params: Record<string, unknown>,
  ) {}
}
