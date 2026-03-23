import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SessionItemDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Session ID',
  })
  id: string;

  @ApiProperty({
    example: 'A01',
    description: 'Locker code',
  })
  lockerCode: string;

  @ApiProperty({
    example: 'Tầng 1 - Khu A',
    description: 'Locker location',
  })
  lockerLocation: string;

  @ApiProperty({
    example: 'ACTIVE',
    description: 'Session status (ACTIVE, COMPLETED, CANCELLED)',
    enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
  })
  status: string;

  @ApiProperty({
    example: 'FACE_ID',
    description: 'Authentication method',
    enum: ['FACE_ID', 'QR_CODE'],
  })
  authMethod: string;

  @ApiProperty({
    example: '2026-03-22T10:00:00.000Z',
    description: 'Check-in timestamp',
  })
  checkInAt: Date;

  @ApiPropertyOptional({
    example: '2026-03-22T12:00:00.000Z',
    description: 'Check-out timestamp (null if still active)',
  })
  checkOutAt: Date | null;

  @ApiProperty({
    example: '2026-03-22T10:00:00.000Z',
    description: 'Session created timestamp',
  })
  createdAt: Date;

  static fromDomain(
    id: string,
    lockerCode: string,
    lockerLocation: string,
    status: string,
    authMethod: string,
    checkInAt: Date,
    checkOutAt: Date | null,
    createdAt: Date,
  ): SessionItemDto {
    const dto = new SessionItemDto();
    dto.id = id;
    dto.lockerCode = lockerCode;
    dto.lockerLocation = lockerLocation;
    dto.status = status;
    dto.authMethod = authMethod;
    dto.checkInAt = checkInAt;
    dto.checkOutAt = checkOutAt;
    dto.createdAt = createdAt;
    return dto;
  }
}
