import { ApiProperty } from '@nestjs/swagger';

export class LockerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  lockerCode: string;

  @ApiProperty()
  location: string;
}

export class CheckInResponseDto {
  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  locker: LockerResponseDto;

  @ApiProperty()
  checkInAt: Date;

  @ApiProperty()
  authMethod: string;

  static fromDomain(
    sessionId: string,
    lockerCode: string,
    lockerLocation: string,
    checkInAt: Date,
    authMethod: string,
  ): CheckInResponseDto {
    const dto = new CheckInResponseDto();
    dto.sessionId = sessionId;
    dto.locker = {
      id: '',
      lockerCode,
      location: lockerLocation,
    };
    dto.checkInAt = checkInAt;
    dto.authMethod = authMethod;
    return dto;
  }
}
