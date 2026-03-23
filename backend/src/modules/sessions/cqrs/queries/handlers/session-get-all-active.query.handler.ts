import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { SessionGetAllActiveQuery } from '../implements/session-get-all-active.query';
import { SessionsRepository } from 'src/modules/sessions/repositories/sessions.repository';
import { PagedResponse } from 'src/shared/configuration/paged.response';
import { Session } from 'src/modules/sessions/domain/session';

@QueryHandler(SessionGetAllActiveQuery)
export class SessionGetAllActiveQueryHandler implements IQueryHandler<SessionGetAllActiveQuery> {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute(
    query: SessionGetAllActiveQuery,
  ): Promise<PagedResponse<Session>> {
    return await this.sessionsRepository.findAllActivePaginated(
      query.pageNumber,
      query.pageSize,
    );
  }
}
