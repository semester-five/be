import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QRTokenEntity } from 'src/modules/qr-tokens/entities/qr-token.entity';
import { QRToken } from 'src/modules/qr-tokens/domain/qr-token';
import { QRTokensMapper } from 'src/modules/qr-tokens/mappers/qr-tokens.mapper';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

@Injectable()
export class QRTokensRepository {
  constructor(
    @InjectRepository(QRTokenEntity)
    private readonly repository: Repository<QRTokenEntity>,
  ) {}

  async save(qrToken: QRToken): Promise<void> {
    await this.repository.save(QRTokensMapper.toEntity(qrToken));
  }

  async findByToken(token: string): Promise<QRToken | null> {
    return QRTokensMapper.toDomainOrNull(
      await this.repository.findOne({ where: { token } }),
    );
  }

  async findById(id: Uuid): Promise<QRToken | null> {
    return QRTokensMapper.toDomainOrNull(
      await this.repository.findOne({ where: { id } }),
    );
  }

  async markAsUsed(id: Uuid): Promise<void> {
    await this.repository.update({ id }, { isUsed: true });
  }

  async findExpired(): Promise<QRToken[]> {
    const entities = await this.repository
      .createQueryBuilder('qr_token')
      .where('qr_token.expiresAt < :now', { now: new Date() })
      .andWhere('qr_token.isUsed = :isUsed', { isUsed: false })
      .getMany();

    return QRTokensMapper.toDomains(entities);
  }

  async deleteExpired(): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .andWhere('isUsed = :isUsed', { isUsed: false })
      .execute();
  }
}
