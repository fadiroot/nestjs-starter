import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {}

  async onModuleInit() {
    if (this.connection.isInitialized) {
      this.logger.log(' Database connected successfully!');
      this.logger.log(
        `Database: ${this.connection.options.database} on ${(this.connection.options as any).host}:${(this.connection.options as any).port}`,
      );
    }
  }
}

