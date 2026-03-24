import { I18nService } from 'nestjs-i18n';
import { ITranslator } from 'src/shared/domain/service/translator.service';

export class NestI18nTranslator implements ITranslator {
  constructor(private readonly i18n: I18nService) {}

  t(key: string, params?: Record<string, any>): string {
    return this.i18n.translate(key, { args: params });
  }
}
