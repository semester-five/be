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
import { SessionGetActiveQuery } from './cqrs/queries/implements/session-get-active.query';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { CICOResponseDto } from './dtos/responses/cico.response.dto';
import { CheckOutResponseDto } from './dtos/responses/check-out.response.dto';

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
  @ApiOperation({ summary: 'Get user sessions' })
  @ApiResponse({ status: 200, description: 'User sessions list' })
  @ApiBearerAuth()
  async getMySessions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('status') _status?: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.queryBus.execute(
      new SessionGetMySessionsQuery(page, limit),
    );
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active session' })
  @ApiResponse({ status: 200, description: 'Active session' })
  @ApiBearerAuth()
  @RequiredRoles([RoleType.ADMIN])
  async getActive() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.queryBus.execute(new SessionGetActiveQuery());
  }
}
