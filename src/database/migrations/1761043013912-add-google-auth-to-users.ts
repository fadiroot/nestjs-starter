import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoogleAuthToUsers1761043013912 implements MigrationInterface {
    name = 'AddGoogleAuthToUsers1761043013912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if google_id column exists before adding it
        const table = await queryRunner.getTable("users");
        const googleIdColumn = table?.findColumnByName("google_id");
        
        if (!googleIdColumn) {
            await queryRunner.query(`ALTER TABLE "users" ADD "google_id" character varying(255)`);
        }
        
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL`);
        
        const table = await queryRunner.getTable("users");
        const googleIdColumn = table?.findColumnByName("google_id");
        
        if (googleIdColumn) {
            await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "google_id"`);
        }
    }

}
