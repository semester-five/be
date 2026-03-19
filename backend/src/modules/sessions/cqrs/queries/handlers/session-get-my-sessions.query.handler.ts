import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { SessionGetMySessionsQuery } from '../implements/session-get-my-sessions.query';
import { SessionsRepository } from 'src/modules/sessions/repositories/sessions.repository';
import { PagedResponse } from 'src/shared/configuration/paged.response';
import { Session } from 'src/modules/sessions/domain/session';

@QueryHandler(SessionGetMySessionsQuery)
export class SessionGetMySessionsQueryHandler implements IQueryHandler<SessionGetMySessionsQuery> {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute(
    query: SessionGetMySessionsQuery,
  ): Promise<PagedResponse<Session>> {
    // TODO: Implement user sessions retrieval with pagination
    return await Promise.resolve({
      data: [],
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      totalRecords: 0,
      totalPages: 0,
    });
  }
}
