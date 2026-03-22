import { ApiProperty } from '@nestjs/swagger';
import { Locker } from '../../domain/lockers';
import { LockerSizeVO } from '../../value-objects/locker-size.vo';
import { LockerStatusVO } from '../../value-objects/locker-status.vo';
import { DoorStateVO } from '../../value-objects/door-state.vo';

export class LockerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    example: 'LKR-001',
    description: 'Unique code for the locker',
  })
  code: string;

  @ApiProperty({
    example: 'First Floor - East Wing',
    description: 'Location of the locker',
  })
  location: string;

  @ApiProperty({
    example: 'SMALL',
    description: 'Size of the locker',
    enum: LockerSizeVO,
  })
  size: LockerSizeVO;

  @ApiProperty({
    example: 'http://example.com/open',
    description: 'URL to open the locker',
  })
  openUrl: string;

  @ApiProperty({
    example: 'http://example.com/close',
    description: 'URL to close the locker',
  })
  closeUrl: string;

  @ApiProperty({
    example: 'IN_USE',
    description: 'Current status of the locker',
    enum: LockerStatusVO,
  })
  status: LockerStatusVO;

  @ApiProperty({
    example: 'OPEN',
    description: 'Current door state of the locker',
    enum: DoorStateVO,
  })
  doorState: DoorStateVO;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(locker: Locker): LockerResponseDto {
    return {
      id: locker.id,
      code: locker.code,
      location: locker.location,
      size: locker.size,
      openUrl: locker.openUrl,
      closeUrl: locker.closeUrl,
      status: locker.status,
      doorState: locker.doorState,
      createdAt: locker.createdAt,
      updatedAt: locker.updatedAt,
    };
  }
}
