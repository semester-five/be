import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldAtUserConnectionTable1774541428325 implements MigrationInterface {
  name = 'AddFieldAtUserConnectionTable1774541428325';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_connections" ADD "device_token" json NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_connections" DROP COLUMN "device_token"`,
    );
  }
}
