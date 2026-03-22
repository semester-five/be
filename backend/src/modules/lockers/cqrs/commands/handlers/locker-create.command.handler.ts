import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LockerCreateCommand } from '../implements/locker-create.command';
import { LockersRepository } from 'src/modules/lockers/repositories/lockers.repository';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(LockerCreateCommand)
export class LockerCreateCommandHandler implements ICommandHandler<LockerCreateCommand> {
  constructor(private readonly lockersRepository: LockersRepository) {}

  async execute(command: LockerCreateCommand): Promise<void> {
    const findByCode = await this.lockersRepository.findByCode(
      command.locker.code,
    );

    if (findByCode) {
      throw new BadRequestException(
        `Locker with code ${command.locker.code} already exists.`,
      );
    }

    await this.lockersRepository.save(command.locker);
  }
}
