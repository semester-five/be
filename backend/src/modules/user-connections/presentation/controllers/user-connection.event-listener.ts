import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { ProjectsEnums } from 'src/modules/events/domain/value-objects/projects.vo';
import { PlatformEnum } from '../../domain/value-objects/platform.vo';
import { UserConnectedCommand } from 'src/modules/user-connections/use-case/commands/implements/user-connected.command';
import { UserDisconnectedCommand } from 'src/modules/user-connections/use-case/commands/implements/user-disconnected.command';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

@Injectable()
export class UserConnectionEventListener {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent('user.connected')
  async handleUserConnected(event: {
    userId: string;
    email: string;
    deviceToken?: string | null;
    platform: PlatformEnum;
    project: ProjectsEnums;
  }): Promise<void> {
    const { userId, email, deviceToken, platform, project } = event;

    await this.commandBus.execute(
      new UserConnectedCommand(
        userId as Uuid,
        email,
        deviceToken ?? null,
        platform,
        project,
      ),
    );
  }

  @OnEvent('user.disconnected')
  async handleUserDisconnected(event: { userId: string }): Promise<void> {
    await this.commandBus.execute(
      new UserDisconnectedCommand(event.userId as Uuid),
    );
  }
}
