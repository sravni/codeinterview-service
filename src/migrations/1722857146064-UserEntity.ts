import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEntity1722857146064 implements MigrationInterface {
    name = 'UserEntity1722857146064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" character varying NOT NULL, "display_name" character varying NOT NULL, "photo" character varying, "created" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
