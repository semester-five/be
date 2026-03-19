import { Module } from '@nestjs/common';
import { LockersController } from './lockers.controller';
import { LockerCreateCommandHandler } from './cqrs/commands/handlers/locker-create.command.handler';
import { LockerUpdateCommandHandler } from './cqrs/commands/handlers/locker-update.command.handler';
import { LockerUpdateStateCommandHandler } from './cqrs/commands/handlers/locker-update-state.command.handler';
import { LockerDeleteCommandHandler } from './cqrs/commands/handlers/locker-delete.command.handler';
import { LockersGetByFiltersQueryHandler } from './cqrs/queries/handlers/lockers-get-by-filters.query.handler';
import { LockerGetByIdQueryHandler } from './cqrs/queries/handlers/locker-get-by-id.query.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LockerEntity } from './entities/lockers.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { LockersRepository } from './repositories/lockers.repository';

const commandHandlers = [
  LockerCreateCommandHandler,
  LockerUpdateCommandHandler,
  LockerUpdateStateCommandHandler,
  LockerDeleteCommandHandler,
];
const queryHandlers = [
  LockersGetByFiltersQueryHandler,
  LockerGetByIdQueryHandler,
];

@Module({
  imports: [TypeOrmModule.forFeature([LockerEntity]), CqrsModule],
  providers: [...commandHandlers, ...queryHandlers, LockersRepository],
  controllers: [LockersController],
  exports: [LockersRepository],
})
export class LockersModule {}
