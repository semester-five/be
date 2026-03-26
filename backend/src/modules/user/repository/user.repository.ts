import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { RoleType } from 'src/guards/role-type';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.save(this.userRepository.create(user));
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findAdminIds(): Promise<Uuid[]> {
    const admins = await this.userRepository.find({
      where: { role: RoleType.ADMIN },
      select: { id: true },
    });

    return admins.map((admin) => admin.id);
  }

  async findById(id: Uuid): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({
      id,
    });
  }

  async findByIdOrThrow(id: Uuid): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new NotFoundException({
        description: `User with ID ${id} not found.`,
      });
    }

    return user;
  }

  async update(userEntity: UserEntity): Promise<void> {
    await this.userRepository.save(userEntity);
  }

  async existBy(email: string): Promise<boolean> {
    return this.userRepository.existsBy({
      email,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email });
  }

  async delete(id: Uuid): Promise<void> {
    await this.userRepository.delete(id);
  }
}
