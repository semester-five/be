import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from 'src/modules/sessions/entities/session.entity';
import { PagedResponse } from 'src/shared/configuration/paged.response';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { Repository } from 'typeorm';
import { GuestDemographicsItem } from '../domain/guest-demographics-item';

type GuestAggregateRow = {
  ageGroup: string;
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN';
  count: string;
};

@Injectable()
export class StatisticsRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async findGuestDemographics(
    dateFrom: Date,
    dateTo: Date,
    pageNumber: number,
    pageSize: number,
    lockerId?: Uuid,
  ): Promise<PagedResponse<GuestDemographicsItem>> {
    const ageBucketCase = `
      CASE
        WHEN session.age IS NULL OR session.age < 0 THEN 'UNKNOWN'
        WHEN session.age <= 17 THEN '0-17'
        WHEN session.age <= 25 THEN '18-25'
        WHEN session.age <= 35 THEN '26-35'
        WHEN session.age <= 45 THEN '36-45'
        WHEN session.age <= 60 THEN '46-60'
        ELSE '61+'
      END
    `;

    const genderCase = `
      CASE
        WHEN session.gender IS NULL OR TRIM(session.gender) = '' THEN 'UNKNOWN'
        WHEN UPPER(session.gender) IN ('MALE', 'M') THEN 'MALE'
        WHEN UPPER(session.gender) IN ('FEMALE', 'F') THEN 'FEMALE'
        ELSE 'UNKNOWN'
      END
    `;

    const queryBuilder = this.sessionRepository
      .createQueryBuilder('session')
      .select(ageBucketCase, 'ageGroup')
      .addSelect(genderCase, 'gender')
      .addSelect('COUNT(*)::text', 'count')
      .where('session.userId IS NULL')
      .andWhere('session.checkInAt >= :dateFrom', { dateFrom })
      .andWhere('session.checkInAt <= :dateTo', { dateTo });

    if (lockerId) {
      queryBuilder.andWhere('session.lockerId = :lockerId', { lockerId });
    }

    const rows = await queryBuilder
      .groupBy(ageBucketCase)
      .addGroupBy(genderCase)
      .getRawMany<GuestAggregateRow>();

    const ageGroupOrder = [
      '0-17',
      '18-25',
      '26-35',
      '36-45',
      '46-60',
      '61+',
      'UNKNOWN',
    ];

    const aggregateMap = new Map<string, GuestDemographicsItem>();
    for (const ageGroup of ageGroupOrder) {
      aggregateMap.set(
        ageGroup,
        new GuestDemographicsItem(ageGroup, 0, 0, 0, 0),
      );
    }

    for (const row of rows) {
      const key = aggregateMap.has(row.ageGroup) ? row.ageGroup : 'UNKNOWN';
      const existing =
        aggregateMap.get(key) ?? new GuestDemographicsItem(key, 0, 0, 0, 0);
      const currentCount = Number(row.count);

      let maleCount = existing.maleCount;
      let femaleCount = existing.femaleCount;
      let unknownCount = existing.unknownCount;

      if (row.gender === 'MALE') {
        maleCount += currentCount;
      } else if (row.gender === 'FEMALE') {
        femaleCount += currentCount;
      } else {
        unknownCount += currentCount;
      }

      aggregateMap.set(
        key,
        new GuestDemographicsItem(
          key,
          maleCount,
          femaleCount,
          unknownCount,
          maleCount + femaleCount + unknownCount,
        ),
      );
    }

    const allItems = Array.from(aggregateMap.values()).filter(
      (item) => item.totalSessions > 0,
    );
    const totalRecords = allItems.length;
    const start = (pageNumber - 1) * pageSize;
    const data = allItems.slice(start, start + pageSize);

    return {
      data,
      pageNumber,
      pageSize,
      totalRecords,
      totalPages: totalRecords === 0 ? 0 : Math.ceil(totalRecords / pageSize),
    };
  }
}
