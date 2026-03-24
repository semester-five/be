import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { TypeormModule } from './infra/typeorm/typeorm.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { NestI18nTranslator } from './infra/i18n/i18n-translator.service';
import { TRANSLATOR_DI_TOKEN } from './di-tokens/translator.di-token';

@Global()
@Module({
  imports: [
    TypeormModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [
    ApiConfigService,
    {
      provide: TRANSLATOR_DI_TOKEN.SERVICE,
      useClass: NestI18nTranslator,
    },
  ],
  exports: [ApiConfigService, TRANSLATOR_DI_TOKEN.SERVICE],
})
export class SharedModule {}
