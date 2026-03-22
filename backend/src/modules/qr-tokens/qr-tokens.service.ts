import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { QRTokensRepository } from 'src/modules/qr-tokens/repositories/qr-tokens.repository';
import { QRToken } from 'src/modules/qr-tokens/domain/qr-token';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

@Injectable()
export class QRTokensService {
  constructor(
    private readonly qrTokensRepository: QRTokensRepository,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(userId: Uuid): Promise<QRToken> {
    const payload = {
      userId,
      type: 'qr_token',
    };

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    const qrToken = QRToken.create({
      token: this.jwtService.sign(payload, {
        expiresIn: '5m',
      }),
      expiresAt,
      isUsed: false,
      userId,
    });

    await this.qrTokensRepository.save(qrToken);

    return qrToken;
  }

  async verifyToken(token: string): Promise<QRToken | null> {
    try {
      this.jwtService.verify(token);

      const qrToken = await this.qrTokensRepository.findByToken(token);

      if (
        !qrToken ||
        !qrToken.userId ||
        qrToken.isUsed ||
        qrToken.expiresAt < new Date()
      ) {
        return null;
      }

      return qrToken;
    } catch {
      return null;
    }
  }

  async markAsUsed(tokenId: Uuid): Promise<void> {
    await this.qrTokensRepository.markAsUsed(tokenId);
  }

  async cleanupExpired(): Promise<void> {
    await this.qrTokensRepository.deleteExpired();
  }
}
