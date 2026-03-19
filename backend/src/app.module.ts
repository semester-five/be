import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { CqrsModule } from '@nestjs/cqrs/dist/cqrs.module';
import { RolesGuard } from './guards/roles.guard';
import { APP_FILTER, APP_GUARD } from '@nestjs/core/constants';
import { JwtAuthGuard } from './decorator/jwt-auth-guard';
import { LoggingExceptionFilter } from './filter/error-handling-exception-filter';
import { SharedModule } from './shared/shared.module';
import { MediaModule } from './modules/media/media.module';
import { S3Module } from './modules/s3/s3.module';
import { LockersModule } from './modules/lockers/lockers.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { QRTokensModule } from './modules/qr-tokens/qr-tokens.module';
import { FaceRecognitionModule } from './modules/face-recognition/face-recognition.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CqrsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SharedModule,
    MediaModule,
    S3Module,
    LockersModule,
    SessionsModule,
    QRTokensModule,
    FaceRecognitionModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: LoggingExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
