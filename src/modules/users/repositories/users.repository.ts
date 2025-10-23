import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { UserDomain } from '../domain/user.domain';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(data: DeepPartial<User>): Promise<UserDomain> {
    const entity = this.repository.create(data);
    const saved = await this.repository.save(entity);
    return UserMapper.entityToDomain(saved);
  }

  async findAll(): Promise<UserDomain[]> {
    const entities = await this.repository.find();
    return UserMapper.entitiesToDomains(entities);
  }

  async findAndCount(options?: any): Promise<[UserDomain[], number]> {
    const [entities, count] = await this.repository.findAndCount(options);
    return [UserMapper.entitiesToDomains(entities), count];
  }

  async findById(id: string): Promise<UserDomain | null> {
    const entity = await this.repository.findOne({ where: { id } as any });
    return entity ? UserMapper.entityToDomain(entity) : null;
  }

  async update(id: string, data: DeepPartial<User>): Promise<UserDomain> {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    Object.assign(entity, data);
    
    const updated = await this.repository.save(entity);
    return UserMapper.entityToDomain(updated);
  }

  async findByEmail(email: string): Promise<UserDomain | null> {
    const entity = await this.repository.findOne({ where: { email } as any });
    return entity ? UserMapper.entityToDomain(entity) : null;
  }

  async findByPhone(phone: string): Promise<UserDomain | null> {
    const entity = await this.repository.findOne({ where: { phone } as any });
    return entity ? UserMapper.entityToDomain(entity) : null;
  }

  async findByRole(roleId: string): Promise<UserDomain[]> {
    const entities = await this.repository.find({ where: { role_id: roleId } as any });
    return UserMapper.entitiesToDomains(entities);
  }

  async findActiveUsers(): Promise<UserDomain[]> {
    const entities = await this.repository.find({ where: { is_active: true } as any });
    return UserMapper.entitiesToDomains(entities);
  }

  async findVerifiedUsers(): Promise<UserDomain[]> {
    const entities = await this.repository.find({ where: { verified: true } as any });
    return UserMapper.entitiesToDomains(entities);
  }

  async updateVerificationStatus(id: string, verified: boolean): Promise<UserDomain> {
    return await this.update(id, { verified } as any);
  }

  async updateActiveStatus(id: string, is_active: boolean): Promise<UserDomain> {
    return await this.update(id, { is_active } as any);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) {
      throw new Error(`User with ID ${id} not found`);
    }
    await this.repository.remove(entity);
  }

  async findByVerificationToken(token: string): Promise<UserDomain | null> {
    const entity = await this.repository.findOne({
      where: { email_verification_token: token } as any,
    });
    return entity ? UserMapper.entityToDomain(entity) : null;
  }

  async updateVerificationFields(
    id: string,
    token: string | null,
    expires: Date | null,
  ): Promise<UserDomain> {
    return await this.update(id, {
      email_verification_token: token,
      email_verification_expires: expires,
    } as any);
  }

  async updatePasswordResetFields(
    id: string,
    code: string | null,
    expires: Date | null,
  ): Promise<UserDomain> {
    return await this.update(id, {
      password_reset_code: code,
      password_reset_expires: expires,
    } as any);
  }

  async updatePassword(id: string, passwordHash: string): Promise<UserDomain> {
    return await this.update(id, { password_hash: passwordHash } as any);
  }
}

export interface IUsersRepository {
  create(data: DeepPartial<User>): Promise<UserDomain>;
  findAll(): Promise<UserDomain[]>;
  findAndCount(options?: any): Promise<[UserDomain[], number]>;
  findById(id: string): Promise<UserDomain | null>;
  update(id: string, data: DeepPartial<User>): Promise<UserDomain>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<UserDomain | null>;
  findByPhone(phone: string): Promise<UserDomain | null>;
  findByRole(roleId: string): Promise<UserDomain[]>;
  findActiveUsers(): Promise<UserDomain[]>;
  findVerifiedUsers(): Promise<UserDomain[]>;
  updateVerificationStatus(id: string, verified: boolean): Promise<UserDomain>;
  updateActiveStatus(id: string, is_active: boolean): Promise<UserDomain>;
  findByVerificationToken(token: string): Promise<UserDomain | null>;
  updateVerificationFields(id: string, token: string | null, expires: Date | null): Promise<UserDomain>;
  updatePasswordResetFields(id: string, code: string | null, expires: Date | null): Promise<UserDomain>;
  updatePassword(id: string, passwordHash: string): Promise<UserDomain>;
}

