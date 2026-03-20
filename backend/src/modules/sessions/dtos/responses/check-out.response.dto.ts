import { ApiProperty } from '@nestjs/swagger';
import { Session } from '../../domain/session';

export class CheckOutResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Session ID',
  })
  sessionId: string;

  @ApiProperty({
    example: 'LOCKER-001',
    description: 'Locker Code',
  })
  lockerCode: string;

  @ApiProperty({
    example: '2023-10-01T10:00:00.000Z',
    description: 'Check-in Date and Time',
  })
  checkInAt: Date;

  @ApiProperty({
    example: '2023-10-01T11:00:00.000Z',
    description: 'Check-out Date and Time',
  })
  checkOutAt: Date;

  @ApiProperty({
    example: 60,
    description: 'Duration in Minutes',
  })
  durationMinutes: number;

  static fromDomain(session: Session): CheckOutResponseDto {
    return {
      sessionId: session.id,
      lockerCode: session.locker.code,
      checkInAt: session.checkInAt,
      checkOutAt: session.checkOutAt!,
      durationMinutes: Math.round(
        (session.checkOutAt!.getTime() - session.checkInAt.getTime()) / 60000,
      ),
    };
  }
}
