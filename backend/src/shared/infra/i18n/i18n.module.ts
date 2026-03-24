import { Module } from '@nestjs/common';
import { NestI18nTranslator } from './i18n-translator.service';

@Module({
  providers: [NestI18nTranslator],
  exports: [NestI18nTranslator],
})
export class I18nModule {}
