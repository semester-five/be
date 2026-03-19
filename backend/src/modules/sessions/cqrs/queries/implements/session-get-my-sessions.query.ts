import { IQuery } from '@nestjs/cqrs';
import { SessionStatusVO } from 'src/modules/sessions/value-objects/session-status.vo';

export class SessionGetMySessionsQuery implements IQuery {
  constructor(
    public readonly pageNumber: number,
    public readonly pageSize: number,
    public readonly status?: SessionStatusVO,
  ) {}
}
