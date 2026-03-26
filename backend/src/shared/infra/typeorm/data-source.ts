import 'reflect-metadata';
import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { SnakeNamingStrategy } from 'src/shared/configuration/snake-naming.strategy';

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT, 10) : 5434,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  dropSchema: false,
  keepConnectionAlive: true,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV !== 'production',
  entities: [
    __dirname + '/../../../modules/**/entities/*.entity{.ts,.js}',
    __dirname + '/../../../modules/**/infra/persistence/*.entity{.ts,.js}',
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  seeds: [
    __dirname + '/../../../modules/**/entities/seeds/*{.ts,.js}',
    __dirname + '/../../../modules/**/infra/seeds/*{.ts,.js}',
  ],
  cli: {
    entitiesDir: 'src',
    subscribersDir: 'subscriber',
  },
} as DataSourceOptions & SeederOptions);
