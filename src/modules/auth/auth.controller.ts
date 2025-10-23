import { Controller, Post, Body, Get, UseGuards, HttpStatus, Query, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponseDto, AuthUserDto } from './dto/auth-response.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../../common/guards/google-auth.guard';

@ApiTags('auth')
@ApiSecurity('language')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with email, name, and password. Sends verification email.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered. Verification email sent.',
    schema: {
      example: {
        message: 'Registration successful! Please check your email to verify your account.',
        email: 'user@example.com',
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
    description: 'Invalid input data. Check validation errors.',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email', 'password must be at least 6 characters'],
        error: 'Bad Request',
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user with email and password. Requires verified email. Returns JWT access token for protected routes.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully authenticated. Returns user information and JWT access token.',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials or email not verified.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Please verify your email before logging in',
        error: 'Unauthorized',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data. Check validation errors.',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email', 'password should not be empty'],
        error: 'Bad Request',
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Get('verify-email')
  @ApiOperation({
    summary: 'Verify email address',
    description: 'Verifies user email address using the token sent via email. Token expires in 1 hour.',
  })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Email verification token',
    example: 'abc123def456ghi789',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified successfully.',
    schema: {
      example: {
        message: 'Email verified successfully! You can now log in.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid or expired token, or email already verified.',
    schema: {
      examples: {
        invalidToken: {
          summary: 'Invalid token',
          value: {
            statusCode: 400,
            message: 'Invalid verification token',
            error: 'Bad Request',
          },
        },
        expiredToken: {
          summary: 'Expired token',
          value: {
            statusCode: 400,
            message: 'Verification token has expired',
            error: 'Bad Request',
          },
        },
        alreadyVerified: {
          summary: 'Already verified',
          value: {
            statusCode: 400,
            message: 'Email already verified',
            error: 'Bad Request',
          },
        },
      },
    },
  })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post('resend-verification')
  @ApiOperation({
    summary: 'Resend verification email',
    description: 'Resends the email verification link to the user. Can be used if the original email was not received or token expired.',
  })
  @ApiBody({ type: ResendVerificationDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verification email resent successfully.',
    schema: {
      example: {
        message: 'Verification email resent successfully!',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Email already verified or user not found.',
    schema: {
      examples: {
        alreadyVerified: {
          summary: 'Already verified',
          value: {
            statusCode: 400,
            message: 'Email already verified',
            error: 'Bad Request',
          },
        },
        notFound: {
          summary: 'User not found',
          value: {
            statusCode: 404,
            message: 'User not found',
            error: 'Not Found',
          },
        },
      },
    },
  })
  async resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(resendVerificationDto.email);
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generate new access and refresh tokens using a valid refresh token. Use this when access token expires.',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens refreshed successfully.',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid refresh token',
        error: 'Unauthorized',
      },
    },
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Initiate Google OAuth login',
    description: 'Redirects to Google OAuth consent screen. User will be redirected back to callback URL after authentication.',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Redirects to Google OAuth consent screen.',
  })
  async googleAuth() {
    // Guard redirects to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Google OAuth callback',
    description: 'Handles the callback from Google OAuth. Creates or logs in user and returns JWT tokens.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully authenticated with Google.',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Failed to authenticate with Google.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Failed to authenticate with Google',
        error: 'Unauthorized',
      },
    },
  })
  async googleAuthCallback(@Req() req) {
    return this.authService.googleLogin(req.user);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Sends a 6-digit verification code to the user\'s email for password reset. Code expires in 15 minutes.',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset code sent successfully.',
    schema: {
      example: {
        message: 'If an account exists with this email, a password reset code has been sent.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid email format.',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be a valid email'],
        error: 'Bad Request',
      },
    },
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Public()
  @Post('verify-reset-code')
  @ApiOperation({
    summary: 'Verify password reset code',
    description: 'Validates the 6-digit code sent to email. Must be done before resetting password.',
  })
  @ApiBody({ type: VerifyResetCodeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Code verified successfully.',
    schema: {
      example: {
        message: 'Code verified successfully. You can now reset your password.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid or expired code.',
    schema: {
      examples: {
        invalidCode: {
          summary: 'Invalid code',
          value: {
            statusCode: 400,
            message: 'Invalid reset code',
            error: 'Bad Request',
          },
        },
        expiredCode: {
          summary: 'Expired code',
          value: {
            statusCode: 400,
            message: 'Reset code has expired',
            error: 'Bad Request',
          },
        },
      },
    },
  })
  async verifyResetCode(@Body() verifyResetCodeDto: VerifyResetCodeDto) {
    return this.authService.verifyResetCode(
      verifyResetCodeDto.email,
      verifyResetCodeDto.code,
    );
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Sets a new password using the verified reset code. Code must be verified first.',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successfully.',
    schema: {
      example: {
        message: 'Password reset successfully! You can now log in with your new password.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid or expired code, or invalid password.',
    schema: {
      examples: {
        invalidCode: {
          summary: 'Invalid code',
          value: {
            statusCode: 400,
            message: 'Invalid reset code',
            error: 'Bad Request',
          },
        },
        expiredCode: {
          summary: 'Expired code',
          value: {
            statusCode: 400,
            message: 'Reset code has expired',
            error: 'Bad Request',
          },
        },
        weakPassword: {
          summary: 'Weak password',
          value: {
            statusCode: 400,
            message: ['password must be at least 6 characters long'],
            error: 'Bad Request',
          },
        },
      },
    },
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.code,
      resetPasswordDto.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieves the authenticated user\'s profile information. Requires valid JWT token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile retrieved successfully.',
    type: AuthUserDto,
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
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }
}

