import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { SessionGetActiveQuery } from '../implements/session-get-active.query';
import { SessionsRepository } from 'src/modules/sessions/repositories/sessions.repository';
import { Session } from 'src/modules/sessions/domain/session';

@QueryHandler(SessionGetActiveQuery)
export class SessionGetActiveQueryHandler implements IQueryHandler<SessionGetActiveQuery> {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_query: SessionGetActiveQuery): Promise<Session | null> {
    // TODO: Implement active session retrieval for authenticated user
    return await Promise.resolve(null);
  }
}
