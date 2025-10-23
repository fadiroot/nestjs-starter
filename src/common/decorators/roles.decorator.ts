import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  MASTER = 'MASTER',
  BARBER = 'BARBER',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

