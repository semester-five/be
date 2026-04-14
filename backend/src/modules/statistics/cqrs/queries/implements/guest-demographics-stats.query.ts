import { IQuery } from '@nestjs/cqrs';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class GuestDemographicsStatsQuery implements IQuery {
  constructor(
    public readonly dateFrom: Date,
    public readonly dateTo: Date,
    public readonly pageNumber: number,
    public readonly pageSize: number,
    public readonly lockerId?: Uuid,
  ) {}
}
