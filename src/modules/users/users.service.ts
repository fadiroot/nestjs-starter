import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BcryptUtil } from '../../utils/bcrypt.util';
import { UsersRepository } from './repositories/users.repository';
import { UserMapper } from './mappers/user.mapper';
import { UserDomain } from './domain/user.domain';
import { RolesService } from '../roles/roles.service';
import { IPaginationReturn, PaginationHelper } from '../../common/pagination';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesService: RolesService,
    private readonly i18n: I18nService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
    const lang = I18nContext.current()?.lang || 'en';

    if (existingUser) {
      throw new ConflictException(
        this.i18n.translate('users.emailAlreadyExists', { lang }),
      );
    }

    if (createUserDto.roleId) {
      try {
        await this.rolesService.findOne(createUserDto.roleId);
      } catch (error) {
        throw new BadRequestException(`Role with ID ${createUserDto.roleId} not found`);
      }
    }

    const hashedPassword = await BcryptUtil.hash(createUserDto.password);
    const entityData = UserMapper.createDtoToEntity(createUserDto, hashedPassword);

    const domain = await this.usersRepository.create(entityData);
    return UserMapper.domainToDto(domain);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<IPaginationReturn<UserResponseDto[]>> {
    const skip = PaginationHelper.calculateSkip(page, limit);

    const [domains, total] = await this.usersRepository.findAndCount({
      skip,
      take: limit,
    });

    return PaginationHelper.createResponse(
      UserMapper.domainsToDtos(domains),
      page,
      limit,
      total,
    );
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const domain = await this.usersRepository.findById(id);
    const lang = I18nContext.current()?.lang || 'en';

    if (!domain) {
      throw new NotFoundException(
        this.i18n.translate('users.userNotFound', { lang }),
      );
    }
    return UserMapper.domainToDto(domain);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const lang = I18nContext.current()?.lang || 'en';

    if (updateUserDto.email) {
      const existingUser = await this.usersRepository.findById(id);
      if (existingUser && updateUserDto.email !== existingUser.email) {
        const emailUser = await this.usersRepository.findByEmail(updateUserDto.email);

        if (emailUser) {
          throw new ConflictException(
            this.i18n.translate('users.emailAlreadyExists', { lang }),
          );
        }
      }
    }

    const entityUpdates = UserMapper.updateDtoToEntity(updateUserDto);
    const domain = await this.usersRepository.update(id, entityUpdates);
    return UserMapper.domainToDto(domain);
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findByEmail(email: string): Promise<UserDomain | null> {
    return await this.usersRepository.findByEmail(email);
  }

  async markAsVerified(id: string): Promise<UserResponseDto> {
    const domain = await this.usersRepository.updateVerificationStatus(id, true);
    return UserMapper.domainToDto(domain);
  }
}
export interface IUsersService {
  create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
  findAll(page?: number, limit?: number): Promise<IPaginationReturn<UserResponseDto[]>>;
  findOne(id: string): Promise<UserResponseDto>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<UserDomain | null>;
  markAsVerified(id: string): Promise<UserResponseDto>;
}

