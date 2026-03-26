import { EventEntity } from 'src/modules/events/infra/persistence/event.entity';
import _ from 'lodash';
import { UserConnection } from 'src/modules/user-connections/domain/entities/user-connection';
import { UserConnectionEntity } from '../persistence/user-connection.entity';

export class UserConnectionMapper {
  static toEntity(userConnection: UserConnection): UserConnectionEntity {
    return {
      id: userConnection.id,
      userId: userConnection.userId,
      email: userConnection.email,
      lastOnlineAt: userConnection.lastOnlineAt,
      deviceToken: userConnection.deviceToken,
      project: userConnection.project,
      platform: userConnection.platform,
      status: userConnection.status,
      createdAt: userConnection.createdAt,
      updatedAt: userConnection.updatedAt,
    };
  }

  static toEntities(
    userConnections: UserConnection[] & { event?: EventEntity }[],
  ): UserConnectionEntity[] {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return _.map(userConnections, this.toEntity);
  }

  static toDomain(userConnectionEntity: UserConnectionEntity): UserConnection {
    return {
      id: userConnectionEntity.id,
      userId: userConnectionEntity.userId,
      email: userConnectionEntity.email,
      lastOnlineAt: userConnectionEntity.lastOnlineAt,
      deviceToken: userConnectionEntity.deviceToken,
      platform: userConnectionEntity.platform,
      project: userConnectionEntity.project,
      status: userConnectionEntity.status,
      createdAt: userConnectionEntity.createdAt,
      updatedAt: userConnectionEntity.updatedAt,
    };
  }

  static toDomains(
    userConnectionEntities: UserConnectionEntity[],
  ): UserConnection[] {
    return _.map(userConnectionEntities, (userConnectionEntity) =>
      this.toDomain(userConnectionEntity),
    );
  }
}
