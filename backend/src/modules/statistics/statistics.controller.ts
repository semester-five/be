import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequiredRoles } from 'src/guards/role-container';
import { RoleType } from 'src/guards/role-type';
import { PagedResponse } from 'src/shared/configuration/paged.response';
import { PagedResponseDto } from 'src/shared/configuration/paged.response.dto';
import { GuestDemographicsStatsQuery } from './cqrs/queries/implements/guest-demographics-stats.query';
import { GuestDemographicsItem } from './domain/guest-demographics-item';
import { GuestDemographicsStatsRequestDto } from './dtos/requests/guest-demographics-stats.request.dto';
import { GuestDemographicsStatsResponseDto } from './dtos/responses/guest-demographics-stats.response.dto';

@Controller('statistics')
@ApiTags('Statistics')
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('guests/demographics')
  @ApiOperation({
    summary:
      'Get anonymous guest demographics statistics grouped by age and gender',
  })
  @ApiResponse({
    status: 200,
    description: 'Guest demographics grouped by age buckets.',
    type: PagedResponseDto<GuestDemographicsStatsResponseDto>,
  })
  @RequiredRoles([RoleType.ADMIN])
  async getGuestDemographics(
    @Query() query: GuestDemographicsStatsRequestDto,
  ): Promise<PagedResponseDto<GuestDemographicsStatsResponseDto>> {
    const pagedData: PagedResponse<GuestDemographicsItem> =
      await this.queryBus.execute(
        new GuestDemographicsStatsQuery(
          new Date(query.dateFrom),
          new Date(query.dateTo),
          query.pageNumber,
          query.pageSize,
          query.lockerId,
        ),
      );

    return PagedResponseDto.fromDomain(pagedData, (item) =>
      GuestDemographicsStatsResponseDto.fromDomain(item),
    );
  }
}
