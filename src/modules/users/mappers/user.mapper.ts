import { User as UserEntity } from '../entities/user.entity';
import { UserDomain } from '../domain/user.domain';
import { UserResponseDto } from '../dto/user-response.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

/**
 * UserMapper - Single Pattern for Data Transfer
 * 
 * Flow Pattern:
 * 1. INPUT:  DTO → Entity (for database operations)
 * 2. LOGIC:  Entity → Domain (for business logic)
 * 3. OUTPUT: Domain → DTO (for API responses)
 */
export class UserMapper {
  // ============================================
  // INPUT: DTO → Entity (for CREATE operations)
  // ============================================
  static createDtoToEntity(dto: CreateUserDto, hashedPassword: string): Partial<UserEntity> {
    return {
      first_name: dto.firstName,
      last_name: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      password_hash: hashedPassword,
      role_id: dto.roleId,
      is_active: true,
      verified: false,
    };
  }

  // ============================================
  // INPUT: DTO → Entity (for UPDATE operations)
  // ============================================
  static updateDtoToEntity(dto: UpdateUserDto): Partial<UserEntity> {
    const entity: Partial<UserEntity> = {};

    if (dto.firstName !== undefined) entity.first_name = dto.firstName;
    if (dto.lastName !== undefined) entity.last_name = dto.lastName;
    if (dto.email !== undefined) entity.email = dto.email;
    if (dto.phone !== undefined) entity.phone = dto.phone;
    if (dto.photoUrl !== undefined) entity.profile_image = dto.photoUrl;
    if (dto.isActive !== undefined) entity.is_active = dto.isActive;
    if (dto.verified !== undefined) entity.verified = dto.verified;

    return entity;
  }

  // ============================================
  // LOGIC: Entity → Domain (for business logic)
  // ============================================
  static entityToDomain(entity: UserEntity): UserDomain {
    if (!entity) return null;

    return new UserDomain({
      id: entity.id,
      firstName: entity.first_name,
      lastName: entity.last_name,
      email: entity.email,
      phone: entity.phone,
      roleId: entity.role_id,
      role: entity.role,
      profileImage: entity.profile_image,
      isActive: entity.is_active,
      verified: entity.verified,
      emailVerificationToken: entity.email_verification_token,
      emailVerificationExpires: entity.email_verification_expires,
      passwordResetCode: entity.password_reset_code,
      passwordResetExpires: entity.password_reset_expires,
      passwordHash: entity.password_hash,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  // ============================================
  // OUTPUT: Domain → DTO (for API responses)
  // ============================================
  static domainToDto(domain: UserDomain): UserResponseDto {
    if (!domain) return null;

    return {
      id: domain.id,
      firstName: domain.firstName,
      lastName: domain.lastName,
      email: domain.email,
      phone: domain.phone,
      photoUrl: domain.profileImage,
      isActive: domain.isActive,
      verified: domain.verified,
      roleId: domain.roleId,
      roleName: domain.role?.name,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  // ============================================
  // SHORTCUT: Entity → DTO (skip domain layer)
  // Use when business logic is not needed
  // ============================================
  static entityToDto(entity: UserEntity): UserResponseDto {
    if (!entity) return null;
    return this.domainToDto(this.entityToDomain(entity));
  }

  // ============================================
  // BULK Operations (Arrays)
  // ============================================
  static entitiesToDomains(entities: UserEntity[]): UserDomain[] {
    return entities.map(entity => this.entityToDomain(entity));
  }

  static domainsToDtos(domains: UserDomain[]): UserResponseDto[] {
    return domains.map(domain => this.domainToDto(domain));
  }

  static entitiesToDtos(entities: UserEntity[]): UserResponseDto[] {
    return entities.map(entity => this.entityToDto(entity));
  }
}
