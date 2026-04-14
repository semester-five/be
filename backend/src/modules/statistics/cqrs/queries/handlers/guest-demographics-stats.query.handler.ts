import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PagedResponse } from 'src/shared/configuration/paged.response';
import { GuestDemographicsStatsQuery } from '../implements/guest-demographics-stats.query';
import { GuestDemographicsItem } from 'src/modules/statistics/domain/guest-demographics-item';
import { StatisticsRepository } from 'src/modules/statistics/repositories/statistics.repository';

@QueryHandler(GuestDemographicsStatsQuery)
export class GuestDemographicsStatsQueryHandler implements IQueryHandler<GuestDemographicsStatsQuery> {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  async execute(
    query: GuestDemographicsStatsQuery,
  ): Promise<PagedResponse<GuestDemographicsItem>> {
    return await this.statisticsRepository.findGuestDemographics(
      query.dateFrom,
      query.dateTo,
      query.pageNumber,
      query.pageSize,
      query.lockerId,
    );
  }
}
