import { Role } from '../../roles/entities/role.entity';

export interface IUser {
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
  createdAt: Date;
  updatedAt: Date;
}

