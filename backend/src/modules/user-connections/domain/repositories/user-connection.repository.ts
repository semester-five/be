import { BaseRepository } from 'src/shared/domain/repositories/base.repository';
import { UserConnection } from '../entities/user-connection';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export interface IUserConnectionsRepository extends BaseRepository<UserConnection> {
  findByUserId(userId: Uuid): Promise<UserConnection | null>;

  findByUserIds(userIds: Uuid[]): Promise<UserConnection[]>;
}
