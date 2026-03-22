import { QRToken } from '../domain/qr-token';
import { QRTokenEntity } from '../entities/qr-token.entity';
import _ from 'lodash';

export class QRTokensMapper {
  static toDomain(entity: QRTokenEntity): QRToken {
    return {
      id: entity.id,
      token: entity.token,
      expiresAt: entity.expiresAt,
      isUsed: entity.isUsed,
      userId: entity.userId,
      sessionId: entity.sessionId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDomains(entities: QRTokenEntity[]): QRToken[] {
    return _.map(entities, (entity) => this.toDomain(entity));
  }

  static toDomainOrNull(entity: QRTokenEntity | null): QRToken | null {
    return entity ? this.toDomain(entity) : null;
  }

  static toEntity(qrToken: QRToken): Partial<QRTokenEntity> {
    return {
      id: qrToken.id,
      token: qrToken.token,
      expiresAt: qrToken.expiresAt,
      isUsed: qrToken.isUsed,
      userId: qrToken.userId,
      sessionId: qrToken.sessionId,
    };
  }
}
