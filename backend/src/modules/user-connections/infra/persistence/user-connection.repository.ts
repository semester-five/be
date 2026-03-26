import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserConnectionEntity } from './user-connection.entity';
import { In, Repository } from 'typeorm';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { UserConnection } from 'src/modules/user-connections/domain/entities/user-connection';
import { IUserConnectionsRepository } from 'src/modules/user-connections/domain/repositories/user-connection.repository';
import { UserConnectionMapper } from '../mappers/user-connection.mapper';
import { StatusEnum } from 'src/modules/user-connections/domain/value-objects/status.vo';
import { PlatformEnum } from 'src/modules/user-connections/domain/value-objects/platform.vo';

@Injectable()
export class UserConnectionRepository implements IUserConnectionsRepository {
  constructor(
    @InjectRepository(UserConnectionEntity)
    private readonly repository: Repository<UserConnectionEntity>,
  ) {}

  async findByUserId(userId: Uuid): Promise<UserConnection | null> {
    return await this.repository.findOneBy({ userId });
  }

  async findByUserIds(userIds: Uuid[]): Promise<UserConnection[]> {
    return UserConnectionMapper.toDomains(
      await this.repository.findBy({
        userId: In(userIds),
      }),
    );
  }

  async findActiveMobileConnectionsByUserId(
    userId: Uuid,
  ): Promise<UserConnection[]> {
    return UserConnectionMapper.toDomains(
      await this.repository.findBy({
        userId,
        status: StatusEnum.ACTIVE,
        platform: PlatformEnum.MOBILE,
      }),
    );
  }

  async save(userConnection: UserConnection): Promise<void> {
    await this.repository.save(UserConnectionMapper.toEntity(userConnection));
  }

  async findAll(): Promise<UserConnection[]> {
    return UserConnectionMapper.toDomains(await this.repository.find());
  }

  async findById(id: Uuid): Promise<UserConnection | null> {
    return await this.repository.findOneBy({ id });
  }
  async delete(id: Uuid): Promise<void> {
    await this.repository.delete({ id });
  }
}
