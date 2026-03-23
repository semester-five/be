import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequiredRoles } from 'src/guards/role-container';
import { RoleType } from 'src/guards/role-type';
import { CICOFaceRequestDto } from './dtos/requests/cico-face.request.dto';
import { CicoQRRequestDto } from './dtos/requests/cico-qr.request.dto';
import { SessionCICOFaceCommand } from './cqrs/commands/implements/session-cico-face.command';
import { SessionCICOQRCommand } from './cqrs/commands/implements/session-cico-qr.command';
import { SessionForceCheckOutCommand } from './cqrs/commands/implements/session-force-checkout.command';
import { SessionGetMySessionsQuery } from './cqrs/queries/implements/session-get-my-sessions.query';
import { SessionGetAllActiveQuery } from './cqrs/queries/implements/session-get-all-active.query';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { CICOResponseDto } from './dtos/responses/cico.response.dto';
import { CheckOutResponseDto } from './dtos/responses/check-out.response.dto';
import { PagedSessionResponseDto } from './dtos/responses/paged-session.response.dto';
import { SessionItemDto } from './dtos/responses/session-item.response.dto';
import { AuthUser } from 'src/decorator/auth-user.decorator';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { SessionStatusVO } from './value-objects/session-status.vo';
import { Session } from './domain/session';
import { PagedResponse } from 'src/shared/configuration/paged.response';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('cico/face')
  @ApiOperation({ summary: 'Check-in/Check-out with FaceID' })
  @ApiResponse({ status: 200, description: 'Check-in/Check-out successful' })
  async cicoByFace(@Body() body: CICOFaceRequestDto): Promise<CICOResponseDto> {
    return CICOResponseDto.fromDomain(
      await this.commandBus.execute(
        new SessionCICOFaceCommand(body.faceVector),
      ),
    );
  }

  @Post('cico/qr')
  @ApiOperation({ summary: 'CICO with QR Code' })
  @ApiResponse({ status: 200, description: 'CICO successful' })
  async cicoByQRCode(
    @Body() cicoQRRequestDto: CicoQRRequestDto,
  ): Promise<CICOResponseDto> {
    return CICOResponseDto.fromDomain(
      await this.commandBus.execute(
        new SessionCICOQRCommand(cicoQRRequestDto.qrToken),
      ),
    );
  }

  @Post(':id/force-checkout')
  @ApiOperation({ summary: 'Admin force check-out' })
  @ApiResponse({ status: 200, description: 'Force check-out successful' })
  @RequiredRoles([RoleType.ADMIN])
  @ApiBearerAuth()
  async forceCheckOut(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body('reason') reason: string,
  ): Promise<CheckOutResponseDto> {
    return CheckOutResponseDto.fromDomain(
      await this.commandBus.execute(
        new SessionForceCheckOutCommand(id, reason),
      ),
    );
  }

  @Get('my-sessions')
  @ApiOperation({ summary: 'Get current user sessions' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of user sessions',
    type: PagedSessionResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 20)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: SessionStatusVO,
    description: 'Filter by session status',
  })
  @ApiBearerAuth()
  @RequiredRoles([RoleType.USER, RoleType.ADMIN])
  async getMySessions(
    @AuthUser() user: UserEntity,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: SessionStatusVO,
  ): Promise<PagedSessionResponseDto> {
    const pagedData: PagedResponse<Session> = await this.queryBus.execute(
      new SessionGetMySessionsQuery(user.id, page, limit, status),
    );

    return {
      data: pagedData.data.map((session) =>
        SessionItemDto.fromDomain(
          session.id,
          session.locker?.code ?? '',
          session.locker?.location ?? '',
          session.status,
          session.authMethod,
          session.checkInAt,
          session.checkOutAt,
          session.createdAt,
        ),
      ),
      pageNumber: pagedData.pageNumber,
      pageSize: pagedData.pageSize,
      totalRecords: pagedData.totalRecords,
      totalPages: pagedData.totalPages,
    };
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active sessions (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of all active sessions',
    type: PagedSessionResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 20)',
  })
  @ApiBearerAuth()
  @RequiredRoles([RoleType.ADMIN])
  async getActiveSessions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<PagedSessionResponseDto> {
    const pagedData: PagedResponse<Session> = await this.queryBus.execute(
      new SessionGetAllActiveQuery(page, limit),
    );

    return {
      data: pagedData.data.map((session) =>
        SessionItemDto.fromDomain(
          session.id,
          session.locker?.code ?? '',
          session.locker?.location ?? '',
          session.status,
          session.authMethod,
          session.checkInAt,
          session.checkOutAt,
          session.createdAt,
        ),
      ),
      pageNumber: pagedData.pageNumber,
      pageSize: pagedData.pageSize,
      totalRecords: pagedData.totalRecords,
      totalPages: pagedData.totalPages,
    };
  }
}
