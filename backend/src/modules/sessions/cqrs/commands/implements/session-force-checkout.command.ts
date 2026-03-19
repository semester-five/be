import { ICommand } from '@nestjs/cqrs';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class SessionForceCheckOutCommand implements ICommand {
  constructor(
    public readonly sessionId: Uuid,
    public readonly reason: string,
  ) {}
}
