import { Inject, Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import { IRenderContentService } from 'src/modules/events/domain/service/render-content.service';
import { TRANSLATOR_DI_TOKEN } from 'src/shared/di-tokens/translator.di-token';
import { ITranslator } from 'src/shared/domain/service/translator.service';

@Injectable()
export class HandlebarsTemplateService implements IRenderContentService {
  constructor(
    @Inject(TRANSLATOR_DI_TOKEN.SERVICE)
    private readonly translator: ITranslator,
  ) {
    Handlebars.registerHelper('t', (key: string, options: unknown) => {
      const hash = this.extractHash(options);
      return this.translator.t(key, hash);
    });
  }

  private extractHash(options: unknown): Record<string, any> | undefined {
    if (typeof options !== 'object' || options === null) {
      return undefined;
    }

    const maybeHash = (options as { hash?: unknown }).hash;
    if (typeof maybeHash !== 'object' || maybeHash === null) {
      return undefined;
    }

    return maybeHash as Record<string, any>;
  }

  render(content: string, params: Record<string, any>): string {
    const compiled = Handlebars.compile(content, {
      noEscape: false,
    });

    return compiled(params);
  }

  validate(content: string): boolean {
    try {
      Handlebars.compile(content);
      return true;
    } catch {
      return false;
    }
  }
}
