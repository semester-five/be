import { ICommand } from '@nestjs/cqrs';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class UserDisconnectedCommand implements ICommand {
  constructor(public readonly userId: Uuid) {}
}
