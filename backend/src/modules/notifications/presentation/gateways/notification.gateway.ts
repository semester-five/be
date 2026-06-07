/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { JwksClient } from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { UserRepository } from 'src/modules/user/repository/user.repository';
import { RoleType } from 'src/guards/role-type';

@Injectable()
@WebSocketGateway({
  namespace: '/ws',
  cors: { origin: '*', credentials: true },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly userSockets = new Map<Uuid, Socket[]>();
  private readonly socketToUser = new Map<string, Uuid>();
  private readonly jwksClient: JwksClient;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly userRepository: UserRepository,
  ) {
    this.jwksClient = new JwksClient({
      jwksUri: this.apiConfigService.keycloakJwtConfig.jwksUri,
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
    });
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = this.extractToken(client);
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.verifyToken(token);
      const user = await this.userRepository.findByKeyCloakId(
        payload.sub as Uuid,
      );

      if (!user || user.role === RoleType.GUEST) {
        client.disconnect();
        return;
      }

      client.data.userId = user.id;

      const sockets = this.userSockets.get(user.id) || [];
      sockets.push(client);
      this.userSockets.set(user.id, sockets);
      this.socketToUser.set(client.id, user.id);

      this.logger.debug(`User ${user.id} connected via WebSocket`);
    } catch (error) {
      this.logger.warn(
        `WebSocket connection rejected: ${(error as Error).message}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = this.socketToUser.get(client.id);
    if (userId) {
      const sockets = this.userSockets
        .get(userId)
        ?.filter((s) => s.id !== client.id);
      if (sockets?.length) {
        this.userSockets.set(userId, sockets);
      } else {
        this.userSockets.delete(userId);
      }
      this.socketToUser.delete(client.id);
    }
  }

  sendToUser(userId: Uuid, event: string, data: unknown): void {
    const sockets = this.userSockets.get(userId);
    if (!sockets?.length) return;
    sockets.forEach((socket) => socket.emit(event, data));
  }

  private extractToken(client: Socket): string | null {
    const auth = client.handshake.auth?.token as string | undefined;
    if (auth) return auth;

    const header = client.handshake.headers?.authorization as
      | string
      | undefined;
    if (header?.startsWith('Bearer ')) return header.slice(7);

    return null;
  }

  private async verifyToken(token: string): Promise<{ sub: string }> {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === 'string') {
      throw new Error('Invalid token: unable to decode');
    }

    const kid = (decoded.header as { kid?: string }).kid;
    if (!kid) {
      throw new Error('Invalid token: missing kid');
    }

    const key = await this.jwksClient.getSigningKey(kid);
    const publicKey = key.getPublicKey();

    return jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    }) as { sub: string };
  }
}
