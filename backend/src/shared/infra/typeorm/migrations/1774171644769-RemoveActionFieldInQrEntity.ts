import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveActionFieldInQrEntity1774171644769 implements MigrationInterface {
  name = 'RemoveActionFieldInQrEntity1774171644769';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "qr_tokens" DROP COLUMN "action"`);
    await queryRunner.query(`DROP TYPE "public"."qr_tokens_action_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."qr_tokens_action_enum" AS ENUM('CHECK_IN', 'CHECK_OUT', 'UPDATE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "qr_tokens" ADD "action" "public"."qr_tokens_action_enum" NOT NULL`,
    );
  }
}
