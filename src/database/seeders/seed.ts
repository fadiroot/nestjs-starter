import { config } from 'dotenv';
import { AppDataSource } from '../typeorm.config';
import { MainSeeder } from './index';

config();

async function runSeeders() {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();
    console.log('Database connection established\n');

    const seeder = new MainSeeder();
    await seeder.run(AppDataSource);

    await AppDataSource.destroy();
    console.log('\n Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

runSeeders();

