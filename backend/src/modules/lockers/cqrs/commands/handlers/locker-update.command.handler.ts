import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LockerUpdateCommand } from '../implements/locker-update.command';
import { LockersRepository } from 'src/modules/lockers/repositories/lockers.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LockersMapper } from 'src/modules/lockers/mappers/lockers.mapper';

@CommandHandler(LockerUpdateCommand)
export class LockerUpdateCommandHandler implements ICommandHandler<LockerUpdateCommand> {
  constructor(private readonly lockersRepository: LockersRepository) {}

  async execute(command: LockerUpdateCommand): Promise<void> {
    const existingLocker = await this.lockersRepository.findById(
      command.locker.id,
    );

    if (!existingLocker) {
      throw new NotFoundException(
        `Locker with ID ${command.locker.id} not found.`,
      );
    }

    if (existingLocker.code !== command.locker.code) {
      const findByCode = await this.lockersRepository.findByCode(
        command.locker.code,
      );

      if (findByCode) {
        throw new BadRequestException(
          `Locker with code ${command.locker.code} already exists.`,
        );
      }
    }

    await this.lockersRepository.save(
      LockersMapper.toEntity({
        ...existingLocker,
        ...command.locker,
      }),
    );
  }
}
