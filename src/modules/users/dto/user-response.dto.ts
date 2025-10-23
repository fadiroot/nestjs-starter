import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/photo.jpg',
    required: false,
  })
  photoUrl?: string;

  @ApiProperty({
    description: 'User account status',
    example: true,
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Email verification status',
    example: false,
    default: false,
  })
  verified: boolean;

  @ApiProperty({
    description: 'Role ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  roleId?: string;

  @ApiProperty({
    description: 'Role name',
    example: 'CUSTOMER',
    required: false,
  })
  roleName?: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}

