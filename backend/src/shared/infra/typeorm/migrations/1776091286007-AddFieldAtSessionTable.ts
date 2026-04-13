import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldAtSessionTable1776091286007 implements MigrationInterface {
  name = 'AddFieldAtSessionTable1776091286007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sessions" ADD "age" integer`);
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD "gender" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "age"`);
  }
}
