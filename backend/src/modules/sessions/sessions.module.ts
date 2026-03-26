import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { SessionEntity } from './entities/session.entity';
import { SessionsRepository } from './repositories/sessions.repository';
import { SessionCICOFaceCommandHandler } from './cqrs/commands/handlers/session-cico-face.command.handler';
import { SessionCICOQRCommandHandler } from './cqrs/commands/handlers/session-cico-qr.command.handler';
import { SessionForceCheckOutCommandHandler } from './cqrs/commands/handlers/session-force-checkout.command.handler';
import { SessionGetMySessionsQueryHandler } from './cqrs/queries/handlers/session-get-my-sessions.query.handler';
import { SessionGetAllActiveQueryHandler } from './cqrs/queries/handlers/session-get-all-active.query.handler';
import { QRTokensModule } from '../qr-tokens/qr-tokens.module';
import { LockersModule } from '../lockers/lockers.module';
import { SessionLockedNotificationCron } from './tasks/session-locked-notification.cron';
import { NotificationsModule } from '../notifications/notifications.module';

const commandHandlers = [
  SessionCICOFaceCommandHandler,
  SessionCICOQRCommandHandler,
  SessionForceCheckOutCommandHandler,
];

const queryHandlers = [
  SessionGetMySessionsQueryHandler,
  SessionGetAllActiveQueryHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity]),
    CqrsModule,
    QRTokensModule,
    LockersModule,
    NotificationsModule,
  ],
  controllers: [SessionsController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    SessionsRepository,
    SessionLockedNotificationCron,
  ],
  exports: [SessionsRepository],
})
export class SessionsModule {}
