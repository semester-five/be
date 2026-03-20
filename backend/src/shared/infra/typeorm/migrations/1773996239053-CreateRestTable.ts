import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRestTable1773996239053 implements MigrationInterface {
  name = 'CreateRestTable1773996239053';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."qr_tokens_action_enum" AS ENUM('CHECK_IN', 'CHECK_OUT', 'UPDATE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "qr_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "action" "public"."qr_tokens_action_enum" NOT NULL, "session_id" uuid, "token" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "is_used" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_194a4f73fd392702a3bc0e438bd" UNIQUE ("token"), CONSTRAINT "PK_a15da7300056c43ee429dec3211" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sessions_status_enum" AS ENUM('ACTIVE', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sessions_auth_method_enum" AS ENUM('FACE_ID', 'QR_CODE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "locker_id" uuid NOT NULL, "check_in_at" TIMESTAMP NOT NULL, "check_out_at" TIMESTAMP, "status" "public"."sessions_status_enum" NOT NULL DEFAULT 'ACTIVE', "auth_method" "public"."sessions_auth_method_enum" NOT NULL, "guest_face_vector" jsonb, "qr_token_id" uuid, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "qr_tokens" ADD CONSTRAINT "FK_72291f056fe4180f9e9b0ffc9e9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_518f688410037a86fde697b78a2" FOREIGN KEY ("locker_id") REFERENCES "lockers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_518f688410037a86fde697b78a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "qr_tokens" DROP CONSTRAINT "FK_72291f056fe4180f9e9b0ffc9e9"`,
    );
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TYPE "public"."sessions_auth_method_enum"`);
    await queryRunner.query(`DROP TYPE "public"."sessions_status_enum"`);
    await queryRunner.query(`DROP TABLE "qr_tokens"`);
    await queryRunner.query(`DROP TYPE "public"."qr_tokens_action_enum"`);
  }
}
