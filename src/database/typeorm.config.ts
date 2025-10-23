import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

// Shared configuration that can be used by both NestJS and CLI
export const typeOrmConfig = {
  type: 'postgres' as const,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: false, // Always false when using migrations
  logging: process.env.NODE_ENV === 'development',
};

export const AppDataSource = new DataSource(typeOrmConfig);

