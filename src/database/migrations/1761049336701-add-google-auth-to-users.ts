import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoogleAuthToUsers1761049336701 implements MigrationInterface {
    name = 'AddGoogleAuthToUsers1761049336701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password_hash" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "google_id" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password_reset_code" character varying(6)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password_reset_expires" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_reset_expires"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_reset_code"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "google_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_hash"`);
    }

}
