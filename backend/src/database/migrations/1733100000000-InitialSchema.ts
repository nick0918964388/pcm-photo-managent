import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1733100000000 implements MigrationInterface {
  name = 'InitialSchema1733100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create projects table
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "code" varchar(50) NOT NULL,
        "name" varchar(255) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_projects_code" UNIQUE ("code"),
        CONSTRAINT "PK_projects" PRIMARY KEY ("id")
      )
    `);

    // Create folders table
    await queryRunner.query(`
      CREATE TABLE "folders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "parent_id" uuid,
        "name" varchar(255) NOT NULL,
        "path_string" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_folders" PRIMARY KEY ("id")
      )
    `);

    // Create media_assets table
    await queryRunner.query(`
      CREATE TABLE "media_assets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "folder_id" uuid NOT NULL,
        "uploader_id" uuid NOT NULL,
        "file_key" varchar(255) NOT NULL,
        "file_type" varchar(20) NOT NULL,
        "metadata" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_media_assets" PRIMARY KEY ("id")
      )
    `);

    // Add foreign keys
    await queryRunner.query(`
      ALTER TABLE "folders"
      ADD CONSTRAINT "FK_folders_project"
      FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "folders"
      ADD CONSTRAINT "FK_folders_parent"
      FOREIGN KEY ("parent_id") REFERENCES "folders"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "media_assets"
      ADD CONSTRAINT "FK_media_assets_folder"
      FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE
    `);

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX "IDX_folders_project_id" ON "folders" ("project_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_folders_parent_id" ON "folders" ("parent_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_media_assets_folder_id" ON "media_assets" ("folder_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_media_assets_uploader_id" ON "media_assets" ("uploader_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "media_assets" DROP CONSTRAINT "FK_media_assets_folder"`,
    );
    await queryRunner.query(
      `ALTER TABLE "folders" DROP CONSTRAINT "FK_folders_parent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "folders" DROP CONSTRAINT "FK_folders_project"`,
    );

    await queryRunner.query(`DROP INDEX "IDX_media_assets_uploader_id"`);
    await queryRunner.query(`DROP INDEX "IDX_media_assets_folder_id"`);
    await queryRunner.query(`DROP INDEX "IDX_folders_parent_id"`);
    await queryRunner.query(`DROP INDEX "IDX_folders_project_id"`);

    await queryRunner.query(`DROP TABLE "media_assets"`);
    await queryRunner.query(`DROP TABLE "folders"`);
    await queryRunner.query(`DROP TABLE "projects"`);
  }
}
