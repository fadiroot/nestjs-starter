import { I18nOptions } from 'nestjs-i18n';
import * as path from 'path';

export const i18nConfig: I18nOptions = {
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(__dirname, '/translations/'),
    watch: true,
  },
  typesOutputPath: path.join(__dirname, '../../src/i18n/i18n.generated.ts'),
};

