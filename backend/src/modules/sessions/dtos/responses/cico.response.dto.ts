import { ApiProperty } from '@nestjs/swagger';
import { Session } from '../../domain/session';
import { SessionStatusVO } from '../../value-objects/session-status.vo';

export class LockerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  lockerCode: string;

  @ApiProperty()
  location: string;
}

export class CICOResponseDto {
  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  sessionStatus: SessionStatusVO;

  @ApiProperty()
  locker: LockerResponseDto;

  @ApiProperty()
  checkInAt: Date;

  @ApiProperty()
  authMethod: string;

  static fromDomain(session: Session): CICOResponseDto {
    return {
      sessionId: session.id,
      sessionStatus: session.status,
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
