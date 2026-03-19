import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QRTokensController } from './qr-tokens.controller';
import { QRTokenEntity } from './entities/qr-token.entity';
import { QRTokensRepository } from './repositories/qr-tokens.repository';
import { QRTokensService } from './qr-tokens.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QRTokenEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'face-locker-secret-key',
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [QRTokensController],
  providers: [QRTokensService, QRTokensRepository],
  exports: [QRTokensService],
})
export class QRTokensModule {}
