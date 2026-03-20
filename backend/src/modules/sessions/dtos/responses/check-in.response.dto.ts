import { ApiProperty } from '@nestjs/swagger';
import { Session } from '../../domain/session';

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

  static fromDomain(session: Session): CheckInResponseDto {
    return {
      sessionId: session.id,
      locker: {
        id: session.lockerId,
        lockerCode: session.locker.code,
        location: session.locker.location,
      },
      checkInAt: session.checkInAt,
      authMethod: session.authMethod,
    };
  }
}
