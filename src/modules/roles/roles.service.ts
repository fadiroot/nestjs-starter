import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { RolesRepository } from './repositories/roles.repository';

@Injectable()
export class RolesService {
  constructor(
    private readonly rolesRepository: RolesRepository,
  ) {}

  async create(name: string, description?: string): Promise<Role> {
    return await this.rolesRepository.create({ name, description } as any);
  }

  async findAll(): Promise<Role[]> {
    return await this.rolesRepository.findAllWithPermissions();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.rolesRepository.getRepository().findOne({
      where: { id } as any,
      relations: ['permissions'],
    });
    if (!role) {
      throw new Error(`Role with ID ${id} not found`);
    }
    return role;
  }

  async findByName(name: string): Promise<Role | null> {
    return await this.rolesRepository.findByName(name);
  }

  async update(
    id: string,
    updates: Partial<Pick<Role, 'name' | 'description'>>,
  ): Promise<Role> {
    return await this.rolesRepository.update(id, updates as any);
  }

  async delete(id: string): Promise<void> {
    await this.rolesRepository.delete(id);
  }

 
}

