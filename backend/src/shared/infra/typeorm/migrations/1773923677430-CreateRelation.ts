import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRelation1773923677430 implements MigrationInterface {
  name = 'CreateRelation1773923677430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "qr_tokens" ADD "userId" uuid`);
    await queryRunner.query(`ALTER TABLE "qr_tokens" ADD "sessionId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "qr_tokens" ADD CONSTRAINT "UQ_7c0f8804f86665a40a74158e386" UNIQUE ("sessionId")`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" ADD "userId" uuid`);
    await queryRunner.query(`ALTER TABLE "sessions" ADD "qrTokenId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "UQ_0322e4cff945fb1714d11f2b359" UNIQUE ("qrTokenId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "qr_tokens" ADD CONSTRAINT "FK_0ca43a5d1718049193ba9255883" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "qr_tokens" ADD CONSTRAINT "FK_7c0f8804f86665a40a74158e386" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_0322e4cff945fb1714d11f2b359" FOREIGN KEY ("qrTokenId") REFERENCES "qr_tokens"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_0322e4cff945fb1714d11f2b359"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "qr_tokens" DROP CONSTRAINT "FK_7c0f8804f86665a40a74158e386"`,
    );
    await queryRunner.query(
      `ALTER TABLE "qr_tokens" DROP CONSTRAINT "FK_0ca43a5d1718049193ba9255883"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "UQ_0322e4cff945fb1714d11f2b359"`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "qrTokenId"`);
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "qr_tokens" DROP CONSTRAINT "UQ_7c0f8804f86665a40a74158e386"`,
    );
    await queryRunner.query(`ALTER TABLE "qr_tokens" DROP COLUMN "sessionId"`);
    await queryRunner.query(`ALTER TABLE "qr_tokens" DROP COLUMN "userId"`);
  }
}
