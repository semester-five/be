import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckInQRRequestDto {
  @ApiProperty({ description: 'QR token from mobile app' })
  @IsNotEmpty()
  @IsString()
  qrToken: string;
}
