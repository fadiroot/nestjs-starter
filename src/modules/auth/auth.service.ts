import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BcryptUtil } from '../../utils/bcrypt.util';
import { JwtPayload, AuthResponse } from './interfaces/jwt-payload.interface';
import { GoogleUser } from './interfaces/google-user.interface';
import { EmailService } from '../email/email.service';
import { TokenUtil } from '../../utils/token.util';
import { UsersRepository } from '../users/repositories/users.repository';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly i18n: I18nService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await BcryptUtil.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException(
        this.i18n.translate('auth.invalidCredentials', {
          lang: I18nContext.current()?.lang || 'en',
        }),
      );
    }

    if (!user.verified) {
      throw new UnauthorizedException(
        this.i18n.translate('auth.emailNotVerified', {
          lang: I18nContext.current()?.lang || 'en',
        }),
      );
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        expiresIn: '7d',
      }),
    };
  }

  async register(registerDto: RegisterDto): Promise<{ message: string; user: any }> {
    const user = await this.usersService.create(registerDto);

    const verificationToken = TokenUtil.generateVerificationToken();
    const tokenExpiration = TokenUtil.getTokenExpiration(1);

    const userDomain = await this.usersRepository.findById(user.id);
    await this.usersRepository.updateVerificationFields(
      user.id,
      verificationToken,
      tokenExpiration,
    );

    await this.emailService.sendVerificationEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      verificationToken,
    );

    return {
      message: this.i18n.translate('auth.registrationSuccess', {
        lang: I18nContext.current()?.lang || 'en',
      }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        verified: false,
      },
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findByVerificationToken(token);
    const lang = I18nContext.current()?.lang || 'en';

    if (!user) {
      throw new BadRequestException(
        this.i18n.translate('auth.invalidVerificationToken', { lang }),
      );
    }

    if (TokenUtil.isTokenExpired(user.emailVerificationExpires)) {
      throw new BadRequestException(
        this.i18n.translate('auth.verificationTokenExpired', { lang }),
      );
    }

    if (user.verified) {
      throw new BadRequestException(
        this.i18n.translate('auth.emailAlreadyVerified', { lang }),
      );
    }

    await this.usersService.markAsVerified(user.id);
    await this.usersRepository.updateVerificationFields(user.id, null, null);

    await this.emailService.sendEmailVerifiedConfirmation(
      user.email,
      user.fullName,
    );

    return {
      message: this.i18n.translate('auth.emailVerifiedSuccess', { lang }),
    };
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const userDomain = await this.usersService.findByEmail(email);
    const lang = I18nContext.current()?.lang || 'en';

    if (!userDomain) {
      throw new NotFoundException(
        this.i18n.translate('auth.userNotFound', { lang }),
      );
    }

    if (userDomain.verified) {
      throw new BadRequestException(
        this.i18n.translate('auth.emailAlreadyVerified', { lang }),
      );
    }

    const verificationToken = TokenUtil.generateVerificationToken();
    const tokenExpiration = TokenUtil.getTokenExpiration(1);

    await this.usersRepository.updateVerificationFields(
      userDomain.id,
      verificationToken,
      tokenExpiration,
    );

    await this.emailService.sendVerificationEmail(
      userDomain.email,
      userDomain.fullName,
      verificationToken,
    );

    return {
      message: this.i18n.translate('auth.verificationEmailResent', { lang }),
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });

      const user = await this.usersService.findOne(payload.sub);
      const lang = I18nContext.current()?.lang || 'en';

      if (!user) {
        throw new UnauthorizedException(
          this.i18n.translate('auth.userNotFound', { lang }),
        );
      }

      if (!user.verified) {
        throw new UnauthorizedException(
          this.i18n.translate('auth.emailNotVerified', { lang }),
        );
      }

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        accessToken: this.jwtService.sign(newPayload),
        refreshToken: this.jwtService.sign(newPayload, {
          secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
          expiresIn: '7d',
        }),
      };
    } catch (error) {
      throw new UnauthorizedException(
        this.i18n.translate('auth.invalidRefreshToken', {
          lang: I18nContext.current()?.lang || 'en',
        }),
      );
    }
  }

  async googleLogin(googleUser: GoogleUser): Promise<AuthResponse> {
    try {
      let user = await this.usersService.findByEmail(googleUser.email);

      if (!user) {
        const createUserDto = {
          email: googleUser.email,
          first_name: googleUser.firstName,
          last_name: googleUser.lastName,
          password_hash: null, 
          google_id: googleUser.id,
          verified: true, 
        };

        user = await this.usersRepository.create(createUserDto);
      }

      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(payload, {
          secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
          expiresIn: '7d',
        }),
      };
    } catch (error) {
      throw new BadRequestException(
        this.i18n.translate('auth.googleAuthFailed', {
          lang: I18nContext.current()?.lang || 'en',
        }),
      );
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);
    return user;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    const lang = I18nContext.current()?.lang || 'en';

    if (!user) {
      return {
        message: this.i18n.translate('auth.passwordResetSent', { lang }),
      };
    }

    const resetCode = TokenUtil.generateResetCode();
    const codeExpiration = new Date();
    codeExpiration.setMinutes(codeExpiration.getMinutes() + 15);

    await this.usersRepository.updatePasswordResetFields(
      user.id,
      resetCode,
      codeExpiration,
    );

    await this.emailService.sendPasswordResetCode(
      user.email,
      user.fullName,
      resetCode,
    );

    return {
      message: this.i18n.translate('auth.passwordResetSent', { lang }),
    };
  }

  async verifyResetCode(email: string, code: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findByEmail(email);
    const lang = I18nContext.current()?.lang || 'en';

    if (!user) {
      throw new BadRequestException(
        this.i18n.translate('auth.invalidResetCode', { lang }),
      );
    }

    if (!user.passwordResetCode || user.passwordResetCode !== code) {
      throw new BadRequestException(
        this.i18n.translate('auth.invalidResetCode', { lang }),
      );
    }

    if (TokenUtil.isTokenExpired(user.passwordResetExpires)) {
      throw new BadRequestException(
        this.i18n.translate('auth.resetCodeExpired', { lang }),
      );
    }

    return {
      message: this.i18n.translate('auth.codeVerifiedSuccess', { lang }),
    };
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findByEmail(email);
    const lang = I18nContext.current()?.lang || 'en';

    if (!user) {
      throw new BadRequestException(
        this.i18n.translate('auth.invalidResetCode', { lang }),
      );
    }

    if (!user.passwordResetCode || user.passwordResetCode !== code) {
      throw new BadRequestException(
        this.i18n.translate('auth.invalidResetCode', { lang }),
      );
    }

    if (TokenUtil.isTokenExpired(user.passwordResetExpires)) {
      throw new BadRequestException(
        this.i18n.translate('auth.resetCodeExpired', { lang }),
      );
    }

    // Hash new password
    const hashedPassword = await BcryptUtil.hash(newPassword);

    // Update password and clear reset code
    await this.usersRepository.updatePassword(user.id, hashedPassword);
    await this.usersRepository.updatePasswordResetFields(user.id, null, null);

    return {
      message: this.i18n.translate('auth.passwordResetSuccess', { lang }),
    };
  }
}

