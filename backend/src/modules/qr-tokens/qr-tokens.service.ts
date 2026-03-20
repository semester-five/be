import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { QRTokensRepository } from 'src/modules/qr-tokens/repositories/qr-tokens.repository';
import { QRToken } from 'src/modules/qr-tokens/domain/qr-token';
import { QRTokenActionVO } from 'src/modules/qr-tokens/value-objects/qr-token-action.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export interface VerifiedToken {
  valid: boolean;
  userId: Uuid | null;
  action: QRTokenActionVO | '';
  sessionId: Uuid | null;
  tokenId?: Uuid;
}

@Injectable()
export class QRTokensService {
  constructor(
    private readonly qrTokensRepository: QRTokensRepository,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(userId: Uuid, action: QRTokenActionVO): Promise<QRToken> {
    const payload = {
      userId,
      action,
      type: 'qr_token',
    };

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    const qrToken = QRToken.create({
      action,
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

  async verifyToken(token: string): Promise<VerifiedToken> {
    try {
      // Verify JWT token
      this.jwtService.verify(token);

      const qrToken = await this.qrTokensRepository.findByToken(token);

      if (!qrToken || !qrToken.userId || !qrToken.action) {
        return {
          valid: false,
          userId: null,
          action: '',
          sessionId: null,
        };
      }

      return {
        valid: true,
        userId: qrToken.userId,
        action: qrToken.action,
        sessionId: qrToken.sessionId,
        tokenId: qrToken.id,
      };
    } catch {
      return {
        valid: false,
        userId: null,
        action: '',
        sessionId: null,
      };
    }
  }

  async markAsUsed(tokenId: Uuid): Promise<void> {
    await this.qrTokensRepository.markAsUsed(tokenId);
  }

  async cleanupExpired(): Promise<void> {
    await this.qrTokensRepository.deleteExpired();
  }
}
