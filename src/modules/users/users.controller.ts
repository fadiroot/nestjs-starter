import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { IPaginationReturn, PaginationQueryDto } from '../../common/pagination';
import { I18nLang, I18nService } from 'nestjs-i18n';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('language')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @Roles(UserRole.MASTER)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user account. Password will be automatically hashed before storage. Only MASTER role can create users.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User creation data',
    examples: {
      withRole: {
        summary: 'Create user with role',
        value: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          password: 'SecureP@ss123',
          roleId: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
      withoutRole: {
        summary: 'Create user without role',
        value: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          password: 'SecureP@ss123',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created. Returns user information without password.',
    type: UserResponseDto,
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        photoUrl: null,
        isActive: true,
        verified: false,
        roleId: '123e4567-e89b-12d3-a456-426614174000',
        roleName: 'MASTER',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Email already exists in the system.',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already exists',
        error: 'Conflict',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or role not found. Check validation errors.',
    schema: {
      examples: {
        validationError: {
          summary: 'Validation error',
          value: {
            statusCode: 400,
            message: ['email must be an email', 'password must be at least 6 characters'],
            error: 'Bad Request',
          },
        },
        roleNotFound: {
          summary: 'Role not found',
          value: {
            statusCode: 400,
            message: 'Role with ID 123e4567-e89b-12d3-a456-426614174000 not found',
            error: 'Bad Request',
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT token.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.MASTER, UserRole.BARBER, UserRole.EMPLOYEE)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a list of all users in the system with pagination support. Passwords are excluded from the response. Available to MASTER, BARBER, and EMPLOYEE roles.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users retrieved successfully with pagination metadata.',
    schema: {
      example: {
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            isActive: true,
            verified: false,
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
          },
        ],
        meta: {
          total: 100,
          page: 1,
          limit: 10,
          totalPages: 10,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT token.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<IPaginationReturn<UserResponseDto[]>> {
    return await this.usersService.findAll(paginationQuery.page, paginationQuery.limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves detailed information about a specific user by their UUID. Password is excluded from the response.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found and returned successfully.',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User with the specified ID not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT token.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.MASTER)
  @ApiOperation({
    summary: 'Update user',
    description: 'Updates user information (email, name, or active status). All fields are optional. Only MASTER role can update users. Note: Password cannot be updated through this endpoint.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully updated. Returns updated user information.',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User with the specified ID not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiConflictResponse({
    description: 'New email already exists in the system.',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already exists',
        error: 'Conflict',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data. Check validation errors.',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email'],
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT token.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.MASTER)
  @ApiOperation({
    summary: 'Delete user',
    description: 'Permanently deletes a user from the system. Only MASTER role can delete users. This action cannot be undone.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully deleted.',
    schema: {
      example: {
        message: 'User deleted successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User with the specified ID not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT token.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  async delete(@Param('id') id: string, @I18nLang() lang: string) {
    await this.usersService.delete(id);
    return {
      message: this.i18n.translate('users.userDeleted', { lang }),
    };
  }
}

