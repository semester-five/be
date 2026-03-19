import { Session } from '../domain/session';
import { SessionEntity } from '../entities/session.entity';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class SessionsMapper {
  static toDomain(entity: SessionEntity): Session {
    return Session.create({
      userId: entity.userId as Uuid,
      lockerId: entity.lockerId as Uuid,
      checkInAt: entity.checkInAt,
      checkOutAt: entity.checkOutAt,
      status: entity.status,
      authMethod: entity.authMethod,
      guestFaceVector: entity.guestFaceVector,
      qrTokenId: entity.qrTokenId as Uuid,
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toDomains(entities: SessionEntity[]): Session[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  static toDomainOrNull(entity: SessionEntity | null): Session | null {
    return entity ? this.toDomain(entity) : null;
  }

  static toEntity(session: Session): Partial<SessionEntity> {
    return {
      id: session.id,
      userId: session.userId,
      lockerId: session.lockerId,
      checkInAt: session.checkInAt,
      checkOutAt: session.checkOutAt,
      status: session.status,
      authMethod: session.authMethod,
      guestFaceVector: session.guestFaceVector,
      qrTokenId: session.qrTokenId,
    };
  }
}
