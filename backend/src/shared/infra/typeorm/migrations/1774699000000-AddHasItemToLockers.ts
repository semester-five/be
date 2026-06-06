import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHasItemToLockers1774699000000 implements MigrationInterface {
  name = 'AddHasItemToLockers1774699000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lockers" ADD "has_item" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lockers" DROP COLUMN "has_item"`);
  }
}
