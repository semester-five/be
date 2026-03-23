import { IQuery } from '@nestjs/cqrs';

export class SessionGetAllActiveQuery implements IQuery {
  constructor(
    public readonly pageNumber: number,
    public readonly pageSize: number,
  ) {}
}
