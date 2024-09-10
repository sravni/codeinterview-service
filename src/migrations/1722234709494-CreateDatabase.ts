import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1722234709494 implements MigrationInterface {
  name = 'CreateDatabase1722234709494';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."interviews_language_enum" AS ENUM('javascript', 'typescript')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."interviews_status_enum" AS ENUM('active', 'archived')`,
    );
    await queryRunner.query(
      `CREATE TABLE "interviews" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" character varying NOT NULL, "author_id" character varying NOT NULL, "interviewee_name" character varying NOT NULL, "language" "public"."interviews_language_enum" NOT NULL DEFAULT 'javascript', "status" "public"."interviews_status_enum" NOT NULL DEFAULT 'active', "code" text NOT NULL DEFAULT '', "created" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_fd41af1f96d698fa33c2f070f47" PRIMARY KEY ("id")); COMMENT ON COLUMN "interviews"."title" IS 'Название'; COMMENT ON COLUMN "interviews"."author_id" IS 'ID автора'; COMMENT ON COLUMN "interviews"."language" IS 'Язык программирования'; COMMENT ON COLUMN "interviews"."status" IS 'Статус интервью'; COMMENT ON COLUMN "interviews"."code" IS 'Код';COMMENT ON COLUMN "interviews"."interviewee_name" IS 'Имя интервьюируемого'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7a90a948e2f62bc99f48ee3e14" ON "interviews" ("title", "status", "author_id", "interviewee_name") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ratings_type_enum" AS ENUM('communication', 'basicKnowledge', 'reasoning', 'decompose', 'design', 'algorithms', 'codeQuality')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ratings" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "interview_id" uuid NOT NULL, "author_id" character varying NOT NULL, "type" "public"."ratings_type_enum" NOT NULL, "rate" double precision NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_0f31425b073219379545ad68ed9" PRIMARY KEY ("id")); COMMENT ON COLUMN "ratings"."author_id" IS 'ID автора'; COMMENT ON COLUMN "ratings"."type" IS 'Тип'; COMMENT ON COLUMN "ratings"."rate" IS 'Значение'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b409c1f56755683308bb40df88" ON "ratings" ("author_id", "interview_id", "type") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."code_tasks_language_enum" AS ENUM('javascript', 'typescript')`,
    );
    await queryRunner.query(
      `CREATE TABLE "code_tasks" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "author_id" character varying NOT NULL, "title" character varying NOT NULL, "code" character varying NOT NULL, "answer" character varying, "language" "public"."code_tasks_language_enum" NOT NULL DEFAULT 'javascript', "created" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_b8adfe490132e25c877c9ca1cf1" PRIMARY KEY ("id")); COMMENT ON COLUMN "code_tasks"."author_id" IS 'ID автора'; COMMENT ON COLUMN "code_tasks"."title" IS 'Название'; COMMENT ON COLUMN "code_tasks"."code" IS 'Код'; COMMENT ON COLUMN "code_tasks"."answer" IS 'Ответ'; COMMENT ON COLUMN "code_tasks"."language" IS 'Язык программирования'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4cf1c5db43b9a7d758a4fc086c" ON "code_tasks" ("title", "language") `,
    );
    await queryRunner.query(
      `ALTER TABLE "ratings" ADD CONSTRAINT "FK_8c426c5ef6942d6896da6eec180" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ratings" DROP CONSTRAINT "FK_8c426c5ef6942d6896da6eec180"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4cf1c5db43b9a7d758a4fc086c"`,
    );
    await queryRunner.query(`DROP TABLE "code_tasks"`);
    await queryRunner.query(`DROP TYPE "public"."code_tasks_language_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b409c1f56755683308bb40df88"`,
    );
    await queryRunner.query(`DROP TABLE "ratings"`);
    await queryRunner.query(`DROP TYPE "public"."ratings_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7a90a948e2f62bc99f48ee3e14"`,
    );
    await queryRunner.query(`DROP TABLE "interviews"`);
    await queryRunner.query(`DROP TYPE "public"."interviews_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."interviews_language_enum"`);
  }
}
