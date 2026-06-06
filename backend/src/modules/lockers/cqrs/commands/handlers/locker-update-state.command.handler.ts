import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LockerUpdateStateCommand } from '../implements/locker-update-state.command';
import { LockersRepository } from 'src/modules/lockers/repositories/lockers.repository';
import { NotFoundException } from '@nestjs/common';
import { MqttService } from 'src/modules/mqtt/mqtt.service';
import { DoorStateVO } from 'src/modules/lockers/value-objects/door-state.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

const CABINET_1_ID = '11111111-1111-1111-1111-111111111111' as Uuid;
const CABINET_2_ID = '22222222-2222-2222-2222-222222222222' as Uuid;

@CommandHandler(LockerUpdateStateCommand)
export class LockerUpdateStateCommandHandler implements ICommandHandler<LockerUpdateStateCommand> {
  constructor(
    private readonly lockersRepository: LockersRepository,
    private readonly mqttService: MqttService,
  ) {}

  async execute(command: LockerUpdateStateCommand): Promise<void> {
    const existingLocker = await this.lockersRepository.findById(command.id);

    if (!existingLocker) {
      throw new NotFoundException(`Locker with ID ${command.id} not found.`);
    }

    await this.lockersRepository.save({
      ...existingLocker,
      status: command.status ?? existingLocker.status,
      doorState: command.doorState ?? existingLocker.doorState,
    });

    const cabinet =
      command.id === CABINET_1_ID ? 1 : command.id === CABINET_2_ID ? 2 : 0;

    if (cabinet === 0) return;

    const type = command.doorState === DoorStateVO.OPEN ? 'OPEN' : 'CLOSE';

    this.mqttService.publish('lockers/commands', {
      type,
      cabinet,
    });
  }
}
