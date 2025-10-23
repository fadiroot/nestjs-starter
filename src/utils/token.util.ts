import * as crypto from 'crypto';

export class TokenUtil {
  static generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static generateResetCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static getTokenExpiration(hours: number = 1): Date {
    const now = new Date();
    now.setHours(now.getHours() + hours);
    return now;
  }

  static isTokenExpired(expiresAt: Date | null): boolean {
    if (!expiresAt) return true;
    return new Date() > new Date(expiresAt);
  }
}