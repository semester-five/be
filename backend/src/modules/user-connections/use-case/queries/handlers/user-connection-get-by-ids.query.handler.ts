import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserConnectionGetByUserIdsQuery } from '../implements/user-connection-get-by-user-ids.query';
import { Inject } from '@nestjs/common';
import { IUserConnectionsRepository } from 'src/modules/user-connections/domain/repositories/user-connection.repository';
import { UserConnection } from 'src/modules/user-connections/domain/entities/user-connection';
import { USER_CONNECTION_DI_TOKEN } from 'src/modules/user-connections/user-connection.di-token';

@QueryHandler(UserConnectionGetByUserIdsQuery)
export class UserConnectionGetByUserIdsQueryHandler implements IQueryHandler<UserConnectionGetByUserIdsQuery> {
  constructor(
    @Inject(USER_CONNECTION_DI_TOKEN.REPOSITORY)
    private readonly repository: IUserConnectionsRepository,
  ) {}

  async execute(
    query: UserConnectionGetByUserIdsQuery,
  ): Promise<UserConnection[]> {
    return this.repository.findByUserIds(query.userIds);
  }
}
