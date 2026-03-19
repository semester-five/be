import { QRToken } from '../domain/qr-token';
import { QRTokenEntity } from '../entities/qr-token.entity';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class QRTokensMapper {
  static toDomain(entity: QRTokenEntity): QRToken {
    return QRToken.create({
      action: entity.action,
      token: entity.token,
      expiresAt: entity.expiresAt,
      isUsed: entity.isUsed,
      userId: entity.userId as Uuid,
      sessionId: entity.sessionId as Uuid,
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toDomains(entities: QRTokenEntity[]): QRToken[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  static toDomainOrNull(entity: QRTokenEntity | null): QRToken | null {
    return entity ? this.toDomain(entity) : null;
  }

  static toEntity(qrToken: QRToken): Partial<QRTokenEntity> {
    return {
      id: qrToken.id,
      action: qrToken.action,
      token: qrToken.token,
      expiresAt: qrToken.expiresAt,
      isUsed: qrToken.isUsed,
      userId: qrToken.userId,
      sessionId: qrToken.sessionId,
    };
  }
}
