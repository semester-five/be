import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { NotificationCreateCommand } from 'src/modules/notifications/use-case/commands/implements/notification-create.command';
import { NotificationCreateRequest } from '../request/notification-create.request';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationGetByUserIdResponseDto } from '../response/notification-get-by-user-id.response.dto';
import { NotificationPrensenterMapper } from '../mapper/notification-prensenter.mapper';
import { ChannelEnum } from 'src/modules/events/domain/value-objects/channel.vo';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('notification.create.command')
  async createNotification(@Payload() data: NotificationCreateRequest) {
    try {
      await this.commandBus.execute(
        new NotificationCreateCommand(
          data.userId as Uuid,
          data.eventCode,
          data.params,
        ),
      );
    } catch (error) {
      this.logger.error('Error creating notification:', error);
    }
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get notifications by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: String })
  @ApiQuery({
    name: 'channels',
    required: false,
    description: 'Filter by channels (comma-separated)',
    enum: ChannelEnum,
    isArray: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of notifications',
    type: [NotificationGetByUserIdResponseDto],
  })
  async getNotificationsByUserId(
    @Param('userId') userId: Uuid,
    @Query('channels') channels?: ChannelEnum[],
  ): Promise<NotificationGetByUserIdResponseDto[]> {
    return NotificationGetByUserIdResponseDto.fromDomains(
      await this.queryBus.execute(
        NotificationPrensenterMapper.toNotificationGetByUserIdQuery(
          userId,
          channels,
        ),
      ),
    );
  }
}
