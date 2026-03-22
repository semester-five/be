import { ApiProperty } from '@nestjs/swagger';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class GenerateQRResponseDto {
  @ApiProperty()
  id: Uuid;

  @ApiProperty()
  token: string;

  @ApiProperty()
  qrCodeBase64: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  expiresInSeconds: number;
}
