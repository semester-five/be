import { ApiProperty } from '@nestjs/swagger';
import { GuestDemographicsItem } from '../../domain/guest-demographics-item';

export class GuestDemographicsStatsResponseDto {
  @ApiProperty({ example: '18-25' })
  ageGroup: string;

  @ApiProperty({ example: 15 })
  maleCount: number;

  @ApiProperty({ example: 22 })
  femaleCount: number;

  @ApiProperty({ example: 3 })
  unknownCount: number;

  @ApiProperty({ example: 40 })
  totalSessions: number;

  static fromDomain(
    item: GuestDemographicsItem,
  ): GuestDemographicsStatsResponseDto {
    return {
      ageGroup: item.ageGroup,
      maleCount: item.maleCount,
      femaleCount: item.femaleCount,
      unknownCount: item.unknownCount,
      totalSessions: item.totalSessions,
    };
  }
}
