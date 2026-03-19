import { Column, Entity, OneToMany } from 'typeorm';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { Gender } from '../domain/gender';
import { AbstractEntity } from 'src/shared/infra/typeorm/persistence/type-orm.abstract.entity';
import { RoleType } from '../../../guards/role-type';
import { SessionEntity } from 'src/modules/sessions/entities/session.entity';
import { QRTokenEntity } from 'src/modules/qr-tokens/entities/qr-token.entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ unique: true, nullable: true })
  keyCloakId?: Uuid;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  picture?: string;

  @Column({ type: 'uuid', nullable: true })
  avatarId: Uuid | null;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender?: Gender;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.USER,
  })
  role: RoleType;

  @Column({ nullable: true })
  appleUserIdentifier?: string;

  @Column({ type: 'date', nullable: true })
  birthday?: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];

  @OneToMany(() => QRTokenEntity, (qrToken) => qrToken.user)
  qrTokens: QRTokenEntity[];
}
