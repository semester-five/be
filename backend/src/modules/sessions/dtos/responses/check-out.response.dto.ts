import { ApiProperty } from '@nestjs/swagger';

export class CheckOutResponseDto {
  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  lockerCode: string;

  @ApiProperty()
  checkInAt: Date;

  @ApiProperty()
  checkOutAt: Date;

  @ApiProperty()
  durationMinutes: number;

  static fromDomain(
    sessionId: string,
    lockerCode: string,
    checkInAt: Date,
    checkOutAt: Date,
  ): CheckOutResponseDto {
    const dto = new CheckOutResponseDto();
    dto.sessionId = sessionId;
    dto.lockerCode = lockerCode;
    dto.checkInAt = checkInAt;
    dto.checkOutAt = checkOutAt;
    dto.durationMinutes = Math.round(
      (checkOutAt.getTime() - checkInAt.getTime()) / 60000,
    );
    return dto;
  }
}
