import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from '../entities/session.entity';
import { Session } from '../domain/session';
import { SessionsMapper } from '../mappers/sessions.mapper';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { PagedResponse } from 'src/shared/configuration/paged.response';
import { SessionStatusVO } from '../value-objects/session-status.vo';
import { AuthMethodVO } from '../value-objects/auth-method.vo';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly repository: Repository<SessionEntity>,
  ) {}

  async save(session: Session): Promise<void> {
    await this.repository.save(SessionsMapper.toEntity(session));
  }

  async findById(id: Uuid): Promise<Session | null> {
    return SessionsMapper.toDomainOrNull(
      await this.repository.findOne({
        where: { id },
        relations: ['locker'],
      }),
    );
  }

  async findByLockerId(lockerId: Uuid): Promise<Session | null> {
    return SessionsMapper.toDomainOrNull(
      await this.repository.findOne({
        where: { lockerId },
        relations: ['locker'],
      }),
    );
  }

  async findActiveByLockerId(lockerId: Uuid): Promise<Session | null> {
    return SessionsMapper.toDomainOrNull(
      await this.repository.findOne({
        where: {
          lockerId,
          status: SessionStatusVO.ACTIVE,
        },
        relations: ['locker'],
      }),
    );
  }

  async findByUserId(
    userId: Uuid,
    pageNumber: number,
    pageSize: number,
    status?: SessionStatusVO,
  ): Promise<PagedResponse<Session>> {
    const queryBuilder = this.repository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.locker', 'locker')
      .where('session.userId = :userId', { userId });

    if (status) {
      queryBuilder.andWhere('session.status = :status', { status });
    }

    const [entities, totalRecords] = await queryBuilder
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .orderBy('session.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: SessionsMapper.toDomains(entities),
      pageNumber,
      pageSize,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    };
  }

  async findAllActivePaginated(
    pageNumber: number,
    pageSize: number,
  ): Promise<PagedResponse<Session>> {
    const queryBuilder = this.repository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.locker', 'locker')
      .where('session.status = :status', { status: SessionStatusVO.ACTIVE });

    const [entities, totalRecords] = await queryBuilder
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .orderBy('session.checkInAt', 'DESC')
      .getManyAndCount();

    return {
      data: SessionsMapper.toDomains(entities),
      pageNumber,
      pageSize,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    };
  }

  async findActiveByUserId(userId: Uuid): Promise<Session | null> {
    return SessionsMapper.toDomainOrNull(
      await this.repository.findOne({
        where: {
          userId,
          status: SessionStatusVO.ACTIVE,
        },
        relations: ['locker'],
      }),
    );
  }

  async findExpiredSessions(expiredAt: Date): Promise<Session[]> {
    const entities = await this.repository.find({
      where: {
        status: SessionStatusVO.ACTIVE,
      },
      relations: ['locker'],
    });

    const expired = entities.filter((entity) => {
      const sessionDuration = expiredAt.getTime() - entity.checkInAt.getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      return sessionDuration > twentyFourHours;
    });

    return SessionsMapper.toDomains(expired);
  }

  async findAllActive(): Promise<Session[]> {
    const entities = await this.repository.find({
      where: { status: SessionStatusVO.ACTIVE },
      relations: ['locker'],
    });
    return SessionsMapper.toDomains(entities);
  }

  async findActiveSessionsCheckedInBetween(
    from: Date,
    to: Date,
  ): Promise<Session[]> {
    const entities = await this.repository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.locker', 'locker')
      .where('session.status = :status', { status: SessionStatusVO.ACTIVE })
      .andWhere('session.checkInAt > :from', { from })
      .andWhere('session.checkInAt <= :to', { to })
      .orderBy('session.checkInAt', 'ASC')
      .getMany();

    return SessionsMapper.toDomains(entities);
  }

  async update(session: Session): Promise<void> {
    await this.repository.update(
      { id: session.id },
      SessionsMapper.toEntity(session),
    );
  }

  async findByFaceMethodAndActive(): Promise<Session[]> {
    return SessionsMapper.toDomains(
      await this.repository.find({
        where: {
          authMethod: AuthMethodVO.FACE_ID,
          status: SessionStatusVO.ACTIVE,
        },
        relations: ['locker'],
      }),
    );
  }
}
