import { IUser } from '../interfaces/user.interface';
import { Role } from '../../roles/entities/role.entity';

export class UserDomain implements IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  roleId: string | null;
  role?: Role;
  profileImage: string | null;
  isActive: boolean;
  verified: boolean;
  emailVerificationToken?: string | null;
  emailVerificationExpires?: Date | null;
  passwordResetCode?: string | null;
  passwordResetExpires?: Date | null;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserDomain>) {
    Object.assign(this, partial);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get isClient(): boolean {
    return this.role?.name === 'CLIENT';
  }

  get isBarber(): boolean {
    return this.role?.name === 'BARBER';
  }

  get isEmployee(): boolean {
    return this.role?.name === 'EMPLOYEE';
  }

  get isMaster(): boolean {
    return this.role?.name === 'MASTER';
  }

  get isStaff(): boolean {
    return this.isMaster || this.isBarber || this.isEmployee;
  }

  canAccessResource(requiredRoles: string[]): boolean {
    if (!this.role) return false;
    return requiredRoles.includes(this.role.name);
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      roleId: this.roleId,
      role: this.role,
      profileImage: this.profileImage,
      isActive: this.isActive,
      verified: this.verified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

