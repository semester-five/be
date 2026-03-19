import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRestTable1771933584926 implements MigrationInterface {
  name = 'CreateRestTable1771933584926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."sessions_status_enum" AS ENUM('ACTIVE', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sessions_auth_method_enum" AS ENUM('FACE_ID', 'QR_CODE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "locker_id" uuid NOT NULL, "check_in_at" TIMESTAMP NOT NULL, "check_out_at" TIMESTAMP, "status" "public"."sessions_status_enum" NOT NULL DEFAULT 'ACTIVE', "auth_method" "public"."sessions_auth_method_enum" NOT NULL, "guest_face_vector" jsonb, "qr_token_id" uuid, "lockerId" uuid, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."qr_tokens_action_enum" AS ENUM('CHECK_IN', 'CHECK_OUT', 'UPDATE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "qr_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "action" "public"."qr_tokens_action_enum" NOT NULL, "session_id" uuid, "token" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "is_used" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_194a4f73fd392702a3bc0e438bd" UNIQUE ("token"), CONSTRAINT "PK_a15da7300056c43ee429dec3211" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_59e0d47c3423365017f9a35f034" FOREIGN KEY ("lockerId") REFERENCES "lockers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_59e0d47c3423365017f9a35f034"`,
    );
    await queryRunner.query(`DROP TABLE "qr_tokens"`);
    await queryRunner.query(`DROP TYPE "public"."qr_tokens_action_enum"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TYPE "public"."sessions_auth_method_enum"`);
    await queryRunner.query(`DROP TYPE "public"."sessions_status_enum"`);
  }
}
