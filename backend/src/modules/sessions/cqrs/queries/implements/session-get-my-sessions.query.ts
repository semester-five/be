import { IQuery } from '@nestjs/cqrs';
import { SessionStatusVO } from 'src/modules/sessions/value-objects/session-status.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class SessionGetMySessionsQuery implements IQuery {
  constructor(
    public readonly userId: Uuid,
    public readonly pageNumber: number,
    public readonly pageSize: number,
    public readonly status?: SessionStatusVO,
  ) {}
}
