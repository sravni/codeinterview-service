import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPythonLanguage1728045626093 implements MigrationInterface {
    name = 'AddPythonLanguage1728045626093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4cf1c5db43b9a7d758a4fc086c"`);
        await queryRunner.query(`ALTER TYPE "public"."code_tasks_language_enum" RENAME TO "code_tasks_language_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."code_tasks_language_enum" AS ENUM('javascript', 'typescript', 'go', 'csharp', 'python')`);
        await queryRunner.query(`ALTER TABLE "code_tasks" ALTER COLUMN "language" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "code_tasks" ALTER COLUMN "language" TYPE "public"."code_tasks_language_enum" USING "language"::"text"::"public"."code_tasks_language_enum"`);
        await queryRunner.query(`ALTER TABLE "code_tasks" ALTER COLUMN "language" SET DEFAULT 'javascript'`);
        await queryRunner.query(`DROP TYPE "public"."code_tasks_language_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."interviews_language_enum" RENAME TO "interviews_language_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."interviews_language_enum" AS ENUM('javascript', 'typescript', 'go', 'csharp', 'python')`);
        await queryRunner.query(`ALTER TABLE "interviews" ALTER COLUMN "language" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "interviews" ALTER COLUMN "language" TYPE "public"."interviews_language_enum" USING "language"::"text"::"public"."interviews_language_enum"`);
        await queryRunner.query(`ALTER TABLE "interviews" ALTER COLUMN "language" SET DEFAULT 'javascript'`);
        await queryRunner.query(`DROP TYPE "public"."interviews_language_enum_old"`);
        await queryRunner.query(`CREATE INDEX "IDX_4cf1c5db43b9a7d758a4fc086c" ON "code_tasks" ("title", "language") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4cf1c5db43b9a7d758a4fc086c"`);
        await queryRunner.query(`CREATE TYPE "public"."interviews_language_enum_old" AS ENUM('javascript', 'typescript', 'go', 'csharp')`);
        await queryRunner.query(`ALTER TABLE "interviews" ALTER COLUMN "language" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "interviews" ALTER COLUMN "language" TYPE "public"."interviews_language_enum_old" USING "language"::"text"::"public"."interviews_language_enum_old"`);
        await queryRunner.query(`ALTER TABLE "interviews" ALTER COLUMN "language" SET DEFAULT 'javascript'`);
        await queryRunner.query(`DROP TYPE "public"."interviews_language_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."interviews_language_enum_old" RENAME TO "interviews_language_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."code_tasks_language_enum_old" AS ENUM('javascript', 'typescript', 'go', 'csharp')`);
        await queryRunner.query(`ALTER TABLE "code_tasks" ALTER COLUMN "language" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "code_tasks" ALTER COLUMN "language" TYPE "public"."code_tasks_language_enum_old" USING "language"::"text"::"public"."code_tasks_language_enum_old"`);
        await queryRunner.query(`ALTER TABLE "code_tasks" ALTER COLUMN "language" SET DEFAULT 'javascript'`);
        await queryRunner.query(`DROP TYPE "public"."code_tasks_language_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."code_tasks_language_enum_old" RENAME TO "code_tasks_language_enum"`);
        await queryRunner.query(`CREATE INDEX "IDX_4cf1c5db43b9a7d758a4fc086c" ON "code_tasks" ("title", "language") `);
    }

}
