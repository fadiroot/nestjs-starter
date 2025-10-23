import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionsRepository } from './repositories/permissions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [PermissionsRepository],
  exports: [PermissionsRepository],
})
export class PermissionsModule {}

