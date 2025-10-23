import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const I18nLang = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.i18nLang || 'en';
  },
);

