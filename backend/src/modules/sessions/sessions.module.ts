import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { SessionEntity } from './entities/session.entity';
import { SessionsRepository } from './repositories/sessions.repository';
import { SessionCheckInFaceCommandHandler } from './cqrs/commands/handlers/session-check-in-face.command.handler';
import { SessionCICOQRCommandHandler } from './cqrs/commands/handlers/session-cico-qr.command.handler';
import { SessionForceCheckOutCommandHandler } from './cqrs/commands/handlers/session-force-checkout.command.handler';
import { SessionGetMySessionsQueryHandler } from './cqrs/queries/handlers/session-get-my-sessions.query.handler';
import { SessionGetActiveQueryHandler } from './cqrs/queries/handlers/session-get-active.query.handler';
import { FaceRecognitionModule } from '../face-recognition/face-recognition.module';
import { QRTokensModule } from '../qr-tokens/qr-tokens.module';
import { LockersModule } from '../lockers/lockers.module';

const commandHandlers = [
  SessionCheckInFaceCommandHandler,
  SessionCICOQRCommandHandler,
  SessionForceCheckOutCommandHandler,
];

const queryHandlers = [
  SessionGetMySessionsQueryHandler,
  SessionGetActiveQueryHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity]),
    CqrsModule,
    FaceRecognitionModule,
    QRTokensModule,
    LockersModule,
  ],
  controllers: [SessionsController],
  providers: [...commandHandlers, ...queryHandlers, SessionsRepository],
  exports: [SessionsRepository],
})
export class SessionsModule {}
