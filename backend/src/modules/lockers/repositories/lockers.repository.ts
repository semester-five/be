import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LockerEntity } from '../entities/lockers.entity';
import { Repository } from 'typeorm';
import { Locker } from '../domain/lockers';
import { LockersMapper } from '../mappers/lockers.mapper';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { PagedResponse } from 'src/shared/configuration/paged.response';
import { LockerStatusVO } from '../value-objects/locker-status.vo';
import { DoorStateVO } from '../value-objects/door-state.vo';

@Injectable()
export class LockersRepository {
  constructor(
    @InjectRepository(LockerEntity)
    private readonly repository: Repository<LockerEntity>,
  ) {}

  async save(locker: Locker): Promise<void> {
    await this.repository.save(LockersMapper.toEntity(locker));
  }

  async findById(id: Uuid): Promise<Locker | null> {
    return LockersMapper.toDomainOrNull(
      await this.repository.findOneBy({ id }),
    );
  }

  async findByCode(code: string): Promise<Locker | null> {
    return LockersMapper.toDomainOrNull(
      await this.repository.findOneBy({ code }),
    );
  }

  async findByEsp32Id(esp32Id: string): Promise<Locker | null> {
    return LockersMapper.toDomainOrNull(
      await this.repository.findOneBy({ esp32Id }),
    );
  }

  async findAll(
    pageNumber: number,
    pageSize: number,
    filters?: {
      status?: string;
      size?: string;
      doorState?: string;
      location?: string;
      code?: string;
      esp32Id?: string;
    },
  ): Promise<PagedResponse<Locker>> {
    const queryBuilder = this.repository.createQueryBuilder('locker');

    if (filters?.status) {
      queryBuilder.andWhere('locker.status = :status', {
        status: filters.status,
      });
    }
    if (filters?.size) {
      queryBuilder.andWhere('locker.size = :size', { size: filters.size });
    }
    if (filters?.doorState) {
      queryBuilder.andWhere('locker.doorState = :doorState', {
        doorState: filters.doorState,
      });
    }
    if (filters?.location) {
      queryBuilder.andWhere('locker.location ILIKE :location', {
        location: `%${filters.location}%`,
      });
    }
    if (filters?.code) {
      queryBuilder.andWhere('locker.code ILIKE :code', {
        code: `%${filters.code}%`,
      });
    }
    if (filters?.esp32Id) {
      queryBuilder.andWhere('locker.esp32Id ILIKE :esp32Id', {
        esp32Id: `%${filters.esp32Id}%`,
      });
    }

    const [entities, totalRecords] = await queryBuilder
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .orderBy('locker.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: LockersMapper.toDomains(entities),
      pageNumber,
      pageSize,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    };
  }

  async delete(id: Uuid): Promise<void> {
    await this.repository.delete({ id });
  }

  async findAvailableLocker(): Promise<Locker | null> {
    return LockersMapper.toDomainOrNull(
      await this.repository.findOne({
        where: { status: LockerStatusVO.AVAILABLE },
        order: { createdAt: 'ASC' },
      }),
    );
  }

  async updateStatus(id: Uuid, status: LockerStatusVO): Promise<void> {
    await this.repository.update({ id }, { status });
  }

  async updateDoorState(id: Uuid, doorState: DoorStateVO): Promise<void> {
    await this.repository.update({ id }, { doorState });
  }
}
