import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class GuestDemographicsStatsRequestDto {
  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Start of filter range (ISO date string)',
  })
  @IsDateString()
  dateFrom: string;

  @ApiProperty({
    example: '2026-01-31T23:59:59.999Z',
    description: 'End of filter range (ISO date string)',
  })
  @IsDateString()
  dateTo: string;

  @ApiPropertyOptional({
    description: 'Optional locker id filter (kiosk)',
  })
  @IsOptional()
  @IsUUID('4')
  lockerId?: Uuid;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Page number for grouped rows',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Page size for grouped rows',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 10;
}
