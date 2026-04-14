import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from '../sessions/entities/session.entity';
import { StatisticsController } from './statistics.controller';
import { GuestDemographicsStatsQueryHandler } from './cqrs/queries/handlers/guest-demographics-stats.query.handler';
import { StatisticsRepository } from './repositories/statistics.repository';

const queryHandlers = [GuestDemographicsStatsQueryHandler];

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity]), CqrsModule],
  controllers: [StatisticsController],
  providers: [...queryHandlers, StatisticsRepository],
})
export class StatisticsModule {}
