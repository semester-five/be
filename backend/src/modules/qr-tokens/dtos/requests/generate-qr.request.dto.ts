import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { QRTokenActionVO } from '../../value-objects/qr-token-action.vo';

export class GenerateQRRequestDto {
  @ApiProperty({ enum: QRTokenActionVO })
  @IsEnum(QRTokenActionVO)
  action: QRTokenActionVO;
}
