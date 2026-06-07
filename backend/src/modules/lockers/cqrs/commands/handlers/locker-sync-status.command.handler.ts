import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LockerSyncStatusCommand } from '../implements/locker-sync-status.command';
import { LockersRepository } from 'src/modules/lockers/repositories/lockers.repository';
import { DoorStateVO } from 'src/modules/lockers/value-objects/door-state.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

const CABINET_1_ID = '11111111-1111-1111-1111-111111111111' as Uuid;
const CABINET_2_ID = '22222222-2222-2222-2222-222222222222' as Uuid;

@CommandHandler(LockerSyncStatusCommand)
export class LockerSyncStatusCommandHandler implements ICommandHandler<LockerSyncStatusCommand> {
  constructor(private readonly lockersRepository: LockersRepository) {}

  async execute(command: LockerSyncStatusCommand): Promise<void> {
    await Promise.all([
      this.updateCabinet(
        CABINET_1_ID,
        command.cabinet1Door,
        command.cabinet1HasItem,
      ),
      this.updateCabinet(
        CABINET_2_ID,
        command.cabinet2Door,
        command.cabinet2HasItem,
      ),
    ]);
  }

  private async updateCabinet(
    lockerId: Uuid,
    doorState: DoorStateVO,
    hasItem: boolean,
  ): Promise<void> {
    const locker = await this.lockersRepository.findById(lockerId);

    if (!locker) return;

    await this.lockersRepository.save({
      ...locker,
      doorState,
      hasItem,
    });
  }
}
