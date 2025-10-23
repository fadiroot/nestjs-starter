import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesRepository extends BaseRepository<Role> implements IRolesRepository {
  constructor(
    @InjectRepository(Role)
    roleRepository: Repository<Role>,
  ) {
    super(roleRepository);
  }

  async findByName(name: string): Promise<Role | null> {
    return await this.getRepository().findOne({
      where: { name } as any,
      relations: ['permissions'],
    });
  }

  async findByNameOrFail(name: string): Promise<Role> {
    const role = await this.findByName(name);
    if (!role) {
      throw new Error(`Role with name ${name} not found`);
    }
    return role;
  }

  async findAllWithPermissions(): Promise<Role[]> {
    return await this.findAll({
      relations: ['permissions'],
    });
  }

  async findAllWithUsers(): Promise<Role[]> {
    return await this.findAll({
      relations: ['users'],
    });
  }

  async nameExists(name: string): Promise<boolean> {
    const count = await this.count({ name } as any);
    return count > 0;
  }

  async countUsersInRole(roleId: string): Promise<number> {
    const role = await this.getRepository().findOne({
      where: { id: roleId } as any,
      relations: ['users'],
    });
    return role?.users?.length || 0;
  }
}

export interface IRolesRepository {
  findByName(name: string): Promise<Role | null>;
  findByNameOrFail(name: string): Promise<Role>;
  findAllWithPermissions(): Promise<Role[]>;
  findAllWithUsers(): Promise<Role[]>;
  nameExists(name: string): Promise<boolean>;
  countUsersInRole(roleId: string): Promise<number>;
}

