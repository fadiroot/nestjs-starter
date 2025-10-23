import { I18nContext } from 'nestjs-i18n';

/**
 * Helper function to get the current language from I18nContext
 * @returns The current language code (en, fr, ar) or 'en' as fallback
 */
export function getCurrentLang(): string {
  return I18nContext.current()?.lang || 'en';
}

/**
 * Helper function to check if a language is supported
 * @param lang - The language code to check
 * @returns true if the language is supported, false otherwise
 */
export function isSupportedLang(lang: string): boolean {
  return ['en', 'fr', 'ar'].includes(lang);
}

/**
 * Translation key paths for better type safety and autocomplete
 */
export const I18nKeys = {
  auth: {
    invalidCredentials: 'auth.invalidCredentials',
    emailNotVerified: 'auth.emailNotVerified',
    registrationSuccess: 'auth.registrationSuccess',
    invalidVerificationToken: 'auth.invalidVerificationToken',
    verificationTokenExpired: 'auth.verificationTokenExpired',
    emailAlreadyVerified: 'auth.emailAlreadyVerified',
    emailVerifiedSuccess: 'auth.emailVerifiedSuccess',
    verificationEmailResent: 'auth.verificationEmailResent',
    userNotFound: 'auth.userNotFound',
    invalidRefreshToken: 'auth.invalidRefreshToken',
    googleAuthFailed: 'auth.googleAuthFailed',
    passwordResetSent: 'auth.passwordResetSent',
    invalidResetCode: 'auth.invalidResetCode',
    resetCodeExpired: 'auth.resetCodeExpired',
    codeVerifiedSuccess: 'auth.codeVerifiedSuccess',
    passwordResetSuccess: 'auth.passwordResetSuccess',
  },
  users: {
    userCreated: 'users.userCreated',
    userUpdated: 'users.userUpdated',
    userDeleted: 'users.userDeleted',
    userNotFound: 'users.userNotFound',
    emailAlreadyExists: 'users.emailAlreadyExists',
  },
  common: {
    success: 'common.success',
    error: 'common.error',
    notFound: 'common.notFound',
    unauthorized: 'common.unauthorized',
    forbidden: 'common.forbidden',
    badRequest: 'common.badRequest',
    internalServerError: 'common.internalServerError',
    created: 'common.created',
    updated: 'common.updated',
    deleted: 'common.deleted',
    welcome: 'common.welcome',
  },
  validation: {
    isNotEmpty: 'validation.isNotEmpty',
    isString: 'validation.isString',
    isEmail: 'validation.isEmail',
    minLength: 'validation.minLength',
    maxLength: 'validation.maxLength',
    isNumber: 'validation.isNumber',
    isBoolean: 'validation.isBoolean',
    isDate: 'validation.isDate',
    isEnum: 'validation.isEnum',
    isInt: 'validation.isInt',
    isPositive: 'validation.isPositive',
    min: 'validation.min',
    max: 'validation.max',
    matches: 'validation.matches',
    isPhoneNumber: 'validation.isPhoneNumber',
    isUrl: 'validation.isUrl',
    isUUID: 'validation.isUUID',
  },
} as const;

