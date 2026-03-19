import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum QRTokenAction {
  CHECK_IN = 'check_in',
  CHECK_OUT = 'check_out',
  UPDATE = 'update',
}

export class GenerateQRRequestDto {
  @ApiProperty({ enum: QRTokenAction })
  @IsEnum(QRTokenAction)
  action: QRTokenAction;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  sessionId?: string;
}
