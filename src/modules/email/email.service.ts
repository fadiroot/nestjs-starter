import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get('MAIL_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const appUrl = this.configService.get('APP_URL');
    const verificationUrl = `${appUrl}/auth/verify-email?token=${token}`;
    
    const mailOptions = {
      from: this.configService.get('MAIL_FROM', 'noreply@barber.com'),
      to: email,
      subject: '✂️ Verify Your Email - Barber App',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .token { background: #f0f0f0; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✂️ Welcome to Barber App!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Thank you for registering! Please verify your email address to activate your account.</p>
              
              <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </p>
              
              <p>Or copy and paste this link in your browser:</p>
              <div class="token">${verificationUrl}</div>
              
              <p><strong>⏱️ This link will expire in 1 hour.</strong></p>
              
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Barber App. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${name},

Welcome to Barber App! Please verify your email address to complete your registration.

Click the link below to verify your email:
${verificationUrl}

This link will expire in 1 hour.

If you didn't create an account, please ignore this email.

Best regards,
The Barber Team
      `.trim(),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Verification email sent to ${email}`);
    } catch (error) {
      console.error('Error sending verification email:', error.message);
      throw new Error('Failed to send verification email');
    }
  }

  async sendEmailVerifiedConfirmation(email: string, name: string) {
    const mailOptions = {
      from: this.configService.get('MAIL_FROM', 'noreply@barber.com'),
      to: email,
      subject: 'Email Verified Successfully',
      text: `
Hello ${name},

Your email has been successfully verified! You can now log in to your account.

Best regards,
The Barber Team
      `.trim(),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Confirmation email sent to ${email}`);
    } catch (error) {
      console.error('Error sending confirmation email:', error.message);
    }
  }

  async sendPasswordResetCode(email: string, name: string, code: string) {
    const mailOptions = {
      from: this.configService.get('MAIL_FROM', 'noreply@barber.com'),
      to: email,
      subject: '🔐 Password Reset Code - Barber App',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; background: #fff; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px dashed #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>We received a request to reset your password. Use the code below to complete the process:</p>
              
              <div class="code">${code}</div>
              
              <p style="text-align: center;"><strong>⏱️ This code will expire in 15 minutes.</strong></p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.
              </div>
              
              <p>Enter this code on the password reset page to set your new password.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Barber App. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${name},

We received a request to reset your password for your Barber App account.

Your password reset code is: ${code}

This code will expire in 15 minutes.

If you didn't request a password reset, please ignore this email.

Best regards,
The Barber Team
      `.trim(),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending password reset email:', error.message);
      throw new Error('Failed to send password reset email');
    }
  }
}

