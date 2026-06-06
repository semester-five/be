import { ICommand } from '@nestjs/cqrs';
import { DoorStateVO } from 'src/modules/lockers/value-objects/door-state.vo';

export class LockerSyncStatusCommand implements ICommand {
  constructor(
    public readonly cabinet1Door: DoorStateVO,
    public readonly cabinet1HasItem: boolean,
    public readonly cabinet2Door: DoorStateVO,
    public readonly cabinet2HasItem: boolean,
  ) {}
}
