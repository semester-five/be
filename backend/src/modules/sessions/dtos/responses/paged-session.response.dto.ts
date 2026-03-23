import { ApiProperty } from '@nestjs/swagger';
import { SessionItemDto } from './session-item.response.dto';

export class PagedSessionResponseDto {
  @ApiProperty({
    type: [SessionItemDto],
    description: 'List of sessions',
  })
  data: SessionItemDto[];

  @ApiProperty({
    example: 1,
    description: 'Current page number',
  })
  pageNumber: number;

  @ApiProperty({
    example: 20,
    description: 'Number of items per page',
  })
  pageSize: number;

  @ApiProperty({
    example: 100,
    description: 'Total number of records',
  })
  totalRecords: number;

  @ApiProperty({
    example: 5,
    description: 'Total number of pages',
  })
  totalPages: number;
}
