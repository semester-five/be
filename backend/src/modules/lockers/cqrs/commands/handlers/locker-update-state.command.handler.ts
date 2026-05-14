import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LockerUpdateStateCommand } from '../implements/locker-update-state.command';
import { LockersRepository } from 'src/modules/lockers/repositories/lockers.repository';
import { NotFoundException } from '@nestjs/common';
import { MqttService } from 'src/modules/mqtt/mqtt.service';
import { DoorStateVO } from 'src/modules/lockers/value-objects/door-state.vo';

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

    this.mqttService.publish(
      'lockers/update',
      `Locker ${existingLocker.code} updated: door ` +
        (existingLocker.doorState === DoorStateVO.OPEN ? 'opened' : 'closed'),
    );
  }
}
