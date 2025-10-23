import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionsRepository extends BaseRepository<Permission> implements IPermissionsRepository {
  constructor(
    @InjectRepository(Permission)
    permissionRepository: Repository<Permission>,
  ) {
    super(permissionRepository);
  }

  async findByName(name: string): Promise<Permission | null> {
    return await this.findOne({ name } as any);
  }

  async findByResource(resource: string): Promise<Permission[]> {
    return await this.findAll({ where: { resource } as any });
  }

  async findByAction(action: string): Promise<Permission[]> {
    return await this.findAll({ where: { action } as any });
  }

  async findByResourceAndAction(
    resource: string,
    action: string,
  ): Promise<Permission | null> {
    return await this.findOne({ resource, action } as any);
  }

  async nameExists(name: string): Promise<boolean> {
    const count = await this.count({ name } as any);
    return count > 0;
  }

  async findAllWithRoles(): Promise<Permission[]> {
    return await this.findAll({
      relations: ['roles'],
    });
  }
}

export interface IPermissionsRepository {
  findByName(name: string): Promise<Permission | null>;
  findByResource(resource: string): Promise<Permission[]>;
  findByAction(action: string): Promise<Permission[]>;
  findByResourceAndAction(resource: string, action: string): Promise<Permission | null>;
  nameExists(name: string): Promise<boolean>;
  findAllWithRoles(): Promise<Permission[]>;
}

