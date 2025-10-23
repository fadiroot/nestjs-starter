import { DataSource } from 'typeorm';
import { RolesSeeder } from './roles.seeder';

export class MainSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('Starting database seeding...\n');

    // Run roles seeder
    console.log('🔄 Seeding roles...');
    const rolesSeeder = new RolesSeeder();
    await rolesSeeder.run(dataSource);

    console.log('\n✅ Database seeding completed successfully!');
  }
}

