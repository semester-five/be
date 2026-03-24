import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotiDb1774343300033 implements MigrationInterface {
  name = 'CreateNotiDb1774343300033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_connections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "email" character varying NOT NULL, "last_online_at" TIMESTAMP NOT NULL, "project" character varying NOT NULL, "platform" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "UQ_c7efd3aae057b64915ac8808b59" UNIQUE ("user_id"), CONSTRAINT "PK_ba2d7906cf6c6251ec5835a6dbd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c7efd3aae057b64915ac8808b5" ON "user_connections" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."events_channel_enum" AS ENUM('email', 'mobile', 'web', 'sms')`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "project" character varying NOT NULL, "auto_subscribe" boolean NOT NULL DEFAULT false, "channel" "public"."events_channel_enum" NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "params" text array NOT NULL, CONSTRAINT "UQ_0dcf33a3c6edf9ba546f30d801e" UNIQUE ("code"), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "event_code" character varying NOT NULL, "target" character varying NOT NULL, "condition" jsonb NOT NULL, "enabled" boolean NOT NULL, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8e8df94f4ddb92ef177acd0a9a" ON "subscriptions" ("user_id", "event_code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "subscription_id" uuid NOT NULL, "params" jsonb NOT NULL, "status" character varying NOT NULL, "message" jsonb NOT NULL, "is_read" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a17c2fb071ddca66770ab6ea09" ON "notifications" ("user_id", "subscription_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1" FOREIGN KEY ("user_id") REFERENCES "user_connections"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_49e49a93777b4e996ddcf320c1b" FOREIGN KEY ("event_code") REFERENCES "events"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_11f0732cb5eaafcc8247be64e92" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_11f0732cb5eaafcc8247be64e92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_49e49a93777b4e996ddcf320c1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a17c2fb071ddca66770ab6ea09"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8e8df94f4ddb92ef177acd0a9a"`,
    );
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TYPE "public"."events_channel_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c7efd3aae057b64915ac8808b5"`,
    );
    await queryRunner.query(`DROP TABLE "user_connections"`);
  }
}
