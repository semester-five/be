import { ApiProperty } from '@nestjs/swagger';

export class GenerateQRResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  qrCodeBase64: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  expiresInSeconds: number;
}

export class VerifyQRResponseDto {
  @ApiProperty()
  valid: boolean;

  @ApiProperty()
  userId: string | null;

  @ApiProperty()
  action: string;

  @ApiProperty()
  sessionId: string | null;
}
