import { AbstractEntity } from 'src/shared/infra/typeorm/persistence/type-orm.abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { QRTokenActionVO } from '../value-objects/qr-token-action.vo';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { SessionEntity } from 'src/modules/sessions/entities/session.entity';

@Entity('qr_tokens')
export class QRTokenEntity extends AbstractEntity {
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => UserEntity, (user) => user.qrTokens, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ enum: QRTokenActionVO, type: 'enum' })
  action: QRTokenActionVO;

  @Column({ type: 'uuid', nullable: true })
  sessionId: string | null;

  @OneToOne(() => SessionEntity, (session) => session.qrToken, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'sessionId' })
  session: SessionEntity;

  @Column({ unique: true })
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  isUsed: boolean;
}
