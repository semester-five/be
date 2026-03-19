import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { QRTokensRepository } from 'src/modules/qr-tokens/repositories/qr-tokens.repository';
import { QRToken } from 'src/modules/qr-tokens/domain/qr-token';
import { QRTokenActionVO } from 'src/modules/qr-tokens/value-objects/qr-token-action.vo';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export interface VerifiedToken {
  valid: boolean;
  userId: string | null;
  action: string;
  sessionId: string | null;
  tokenId?: Uuid;
}

@Injectable()
export class QRTokensService {
  constructor(
    private readonly qrTokensRepository: QRTokensRepository,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(action: string, sessionId?: string): Promise<QRToken> {
    const payload = {
      action,
      sessionId,
      type: 'qr_token',
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '5m',
    });

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    const qrToken = QRToken.create({
      action: action.toUpperCase() as QRTokenActionVO,
      token,
      expiresAt,
      isUsed: false,
      userId: null,
      sessionId: sessionId as Uuid,
    });

    await this.qrTokensRepository.save(qrToken);

    return qrToken;
  }

  async verifyToken(token: string): Promise<VerifiedToken> {
    try {
      // Verify JWT token
      this.jwtService.verify(token);

      const qrToken = await this.qrTokensRepository.findByToken(token);

      if (!qrToken) {
        return {
          valid: false,
          userId: null,
          action: '',
          sessionId: null,
        };
      }

      if (qrToken.isUsed) {
        return {
          valid: false,
          userId: null,
          action: '',
          sessionId: null,
        };
      }

      if (qrToken.checkExpired()) {
        return {
          valid: false,
          userId: null,
          action: '',
          sessionId: null,
        };
      }

      return {
        valid: true,
        userId: qrToken.userId as string | null,
        action: qrToken.action.toLowerCase(),
        sessionId: qrToken.sessionId as string | null,
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
