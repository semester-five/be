import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'src/shared/configuration/snake-naming.strategy';
import { ApiConfigService } from 'src/shared/services/api-config.service';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ApiConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      dropSchema: false,
      keepConnectionAlive: true,
      entities: [
        __dirname + '/../../../modules/**/entities/*.entity{.ts,.js}',
        __dirname + '/../../../modules/**/infra/persistence/*.entity{.ts,.js}',
      ],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        subscribersDir: 'subscriber',
      },
      migrationsRun: true,
      namingStrategy: new SnakeNamingStrategy(),
      ...this.configService.dbConfig,
      logging: false,
    } as TypeOrmModuleOptions;
  }
}
