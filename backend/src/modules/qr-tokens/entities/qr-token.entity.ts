import { AbstractEntity } from 'src/shared/infra/typeorm/persistence/type-orm.abstract.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { QRTokenActionVO } from '../value-objects/qr-token-action.vo';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { SessionEntity } from 'src/modules/sessions/entities/session.entity';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

@Entity('qr_tokens')
export class QRTokenEntity extends AbstractEntity {
  @Column({ type: 'uuid', nullable: true })
  userId: Uuid;

  @ManyToOne(() => UserEntity, (user) => user.qrTokens, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: UserEntity;

  @Column({ enum: QRTokenActionVO, type: 'enum' })
  action: QRTokenActionVO;

  @Column({ type: 'uuid', nullable: true })
  sessionId: Uuid | null;

  @OneToOne(() => SessionEntity, (session) => session.qrToken, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  session: SessionEntity;

  @Column({ unique: true })
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  isUsed: boolean;
}
