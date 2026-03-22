import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFieldInLockerTable1774178004466 implements MigrationInterface {
  name = 'ChangeFieldInLockerTable1774178004466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lockers" DROP CONSTRAINT "UQ_79f3fbb450b51122ddcc3297426"`,
    );
    await queryRunner.query(`ALTER TABLE "lockers" DROP COLUMN "esp32_id"`);
    await queryRunner.query(`ALTER TABLE "lockers" DROP COLUMN "relay_pin"`);
    await queryRunner.query(`ALTER TABLE "lockers" DROP COLUMN "sensor_pin"`);
    await queryRunner.query(
      `ALTER TABLE "lockers" ADD "open_url" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lockers" ADD CONSTRAINT "UQ_d21d6bc09457c6c93b875f9ac2f" UNIQUE ("open_url")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lockers" ADD "close_url" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lockers" ADD CONSTRAINT "UQ_c7fda03da90405fbf8a6aab0458" UNIQUE ("close_url")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lockers" DROP CONSTRAINT "UQ_c7fda03da90405fbf8a6aab0458"`,
    );
    await queryRunner.query(`ALTER TABLE "lockers" DROP COLUMN "close_url"`);
    await queryRunner.query(
      `ALTER TABLE "lockers" DROP CONSTRAINT "UQ_d21d6bc09457c6c93b875f9ac2f"`,
    );
    await queryRunner.query(`ALTER TABLE "lockers" DROP COLUMN "open_url"`);
    await queryRunner.query(
      `ALTER TABLE "lockers" ADD "sensor_pin" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lockers" ADD "relay_pin" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lockers" ADD "esp32_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lockers" ADD CONSTRAINT "UQ_79f3fbb450b51122ddcc3297426" UNIQUE ("esp32_id")`,
    );
  }
}
