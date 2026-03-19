import { AbstractEntity } from 'src/shared/infra/typeorm/persistence/type-orm.abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { SessionStatusVO } from '../value-objects/session-status.vo';
import { AuthMethodVO } from '../value-objects/auth-method.vo';
import { LockerEntity } from 'src/modules/lockers/entities/lockers.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { QRTokenEntity } from 'src/modules/qr-tokens/entities/qr-token.entity';

@Entity('sessions')
export class SessionEntity extends AbstractEntity {
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'uuid' })
  lockerId: string;

  @ManyToOne(() => LockerEntity, (locker) => locker.sessions)
  @JoinColumn({ name: 'lockerId' })
  locker: LockerEntity;

  @Column({ type: 'timestamp' })
  checkInAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOutAt: Date | null;

  @Column({
    enum: SessionStatusVO,
    type: 'enum',
    default: SessionStatusVO.ACTIVE,
  })
  status: SessionStatusVO;

  @Column({ enum: AuthMethodVO, type: 'enum' })
  authMethod: AuthMethodVO;

  @Column({ type: 'jsonb', nullable: true })
  guestFaceVector: number[] | null;

  @Column({ type: 'uuid', nullable: true })
  qrTokenId: string | null;

  @OneToOne(() => QRTokenEntity, (qrToken) => qrToken.session, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'qrTokenId' })
  qrToken: QRTokenEntity;
}
