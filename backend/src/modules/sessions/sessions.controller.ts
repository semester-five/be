import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequiredRoles } from 'src/guards/role-container';
import { RoleType } from 'src/guards/role-type';
import { CheckInFaceRequestDto } from './dtos/requests/check-in-face.request.dto';
import { CheckInQRRequestDto } from './dtos/requests/check-in-qr.request.dto';
import { SessionUpdateRequestDto } from './dtos/requests/session-update.request.dto';
import { CheckOutRequestDto } from './dtos/requests/check-out.request.dto';
import { SessionCheckInFaceCommand } from './cqrs/commands/implements/session-check-in-face.command';
import { SessionCheckInQRCommand } from './cqrs/commands/implements/session-check-in-qr.command';
import { SessionUpdateCommand } from './cqrs/commands/implements/session-update.command';
import { SessionCheckOutCommand } from './cqrs/commands/implements/session-check-out.command';
import { SessionForceCheckOutCommand } from './cqrs/commands/implements/session-force-checkout.command';
import { SessionGetMySessionsQuery } from './cqrs/queries/implements/session-get-my-sessions.query';
import { SessionGetActiveQuery } from './cqrs/queries/implements/session-get-active.query';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { CheckInResponseDto } from './dtos/responses/check-in.response.dto';
import { CheckOutResponseDto } from './dtos/responses/check-out.response.dto';
import { Session } from './domain/session';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('check-in/face')
  @ApiOperation({ summary: 'Check-in with FaceID' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Check-in successful' })
  @UseInterceptors(FileInterceptor('faceImage'))
  async checkInFace(
    @Body() _body: CheckInFaceRequestDto,
    @UploadedFile() faceImage: Express.Multer.File,
  ): Promise<CheckInResponseDto> {
    const session: Session = await this.commandBus.execute(
      new SessionCheckInFaceCommand(faceImage),
    );

    return CheckInResponseDto.fromDomain(
      session.id,
      session.lockerId,
      'Floor 1',
      session.checkInAt,
      session.authMethod,
    );
  }

  @Post('check-in/qr')
  @ApiOperation({ summary: 'Check-in with QR Code' })
  @ApiResponse({ status: 200, description: 'Check-in successful' })
  async checkInQR(
    @Body() checkInQRRequestDto: CheckInQRRequestDto,
  ): Promise<CheckInResponseDto> {
    const session: Session = await this.commandBus.execute(
      new SessionCheckInQRCommand(checkInQRRequestDto.qrToken),
    );

    return CheckInResponseDto.fromDomain(
      session.id,
      session.lockerId,
      'Floor 1',
      session.checkInAt,
      session.authMethod,
    );
  }

  @Post(':id/update')
  @ApiOperation({ summary: 'Update session (add items)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Session updated successfully' })
  @UseInterceptors(FileInterceptor('faceImage'))
  async updateSession(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: SessionUpdateRequestDto,
    @UploadedFile() faceImage: Express.Multer.File,
  ) {
    await this.commandBus.execute(
      new SessionUpdateCommand(id as Uuid, faceImage, body.qrToken),
    );

    return { success: true, message: 'Locker opened' };
  }

  @Post(':id/check-out')
  @ApiOperation({ summary: 'Check-out items' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Check-out successful' })
  @UseInterceptors(FileInterceptor('faceImage'))
  async checkOut(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CheckOutRequestDto,
    @UploadedFile() faceImage: Express.Multer.File,
  ): Promise<CheckOutResponseDto> {
    const session: Session = await this.commandBus.execute(
      new SessionCheckOutCommand(id as Uuid, faceImage, body.qrToken),
    );

    return CheckOutResponseDto.fromDomain(
      session.id,
      session.lockerId,
      session.checkInAt,
      session.checkOutAt!,
    );
  }

  @Post(':id/force-checkout')
  @ApiOperation({ summary: 'Admin force check-out' })
  @ApiResponse({ status: 200, description: 'Force check-out successful' })
  @RequiredRoles([RoleType.ADMIN])
  @ApiBearerAuth()
  async forceCheckOut(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
  ): Promise<CheckOutResponseDto> {
    const session: Session = await this.commandBus.execute(
      new SessionForceCheckOutCommand(id as Uuid, reason),
    );

    return CheckOutResponseDto.fromDomain(
      session.id,
      session.lockerId,
      session.checkInAt,
      session.checkOutAt!,
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
  async getActive() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.queryBus.execute(new SessionGetActiveQuery());
  }
}
