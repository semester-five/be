import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CheckOutRequestDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  faceImage?: Express.Multer.File;

  @ApiPropertyOptional({ description: 'QR token instead of face image' })
  @IsOptional()
  @IsString()
  qrToken?: string;
}
