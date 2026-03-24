import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './infra/persistence/event.entity';
import { EventRepository } from './infra/persistence/event.repository';
import { HandlebarsTemplateService } from './infra/service/handlebars-template.service';
import { EVENT_DI_TOKEN } from './events.di-token';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  providers: [
    {
      provide: EVENT_DI_TOKEN.REPOSITORY,
      useClass: EventRepository,
    },
    {
      provide: EVENT_DI_TOKEN.RENDER_CONTENT_SERVICE,
      useClass: HandlebarsTemplateService,
    },
  ],
  exports: [EVENT_DI_TOKEN.REPOSITORY, EVENT_DI_TOKEN.RENDER_CONTENT_SERVICE],
})
export class EventsModule {}
