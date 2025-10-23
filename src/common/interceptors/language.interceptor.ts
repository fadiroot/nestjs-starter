import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const acceptLanguage = request.headers['accept-language'];
    
    // Extract language from Accept-Language header
    // Format: en, fr, ar, en-US, fr-FR, ar-SA
    let language = 'en'; // default
    
    if (acceptLanguage) {
      const primaryLanguage = acceptLanguage.split(',')[0].split('-')[0].trim();
      if (['en', 'fr', 'ar'].includes(primaryLanguage)) {
        language = primaryLanguage;
      }
    }
    
    // Also check for custom header
    const customLang = request.headers['x-language'] || request.headers['x-lang'];
    if (customLang && ['en', 'fr', 'ar'].includes(customLang)) {
      language = customLang;
    }
    
    request.i18nLang = language;
    
    return next.handle();
  }
}

