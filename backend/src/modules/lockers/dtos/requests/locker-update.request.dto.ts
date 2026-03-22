import { ApiProperty } from '@nestjs/swagger';
import { LockerSizeVO } from '../../value-objects/locker-size.vo';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LockerStatusVO } from '../../value-objects/locker-status.vo';
import { DoorStateVO } from '../../value-objects/door-state.vo';
import { Locker } from '../../domain/lockers';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class LockerUpdateRequestDto {
  @ApiProperty({
    example: 'LKR-001',
    description: 'Unique code for the locker',
  })
  @IsString()
  code: string;

  @ApiProperty({
    example: 'First Floor - East Wing',
    description: 'Location of the locker',
  })
  @IsString()
  location: string;

  @ApiProperty({
    example: 'SMALL',
    description: 'Size of the locker (e.g., SMALL, MEDIUM, LARGE)',
  })
  @IsEnum(LockerSizeVO)
  size: LockerSizeVO;

  @ApiProperty({
    example: 'https://api.locker-system.com/lockers/LKR-001/open',
    description: 'API endpoint to open the locker',
  })
  @IsString()
  @IsNotEmpty()
  openUrl: string;

  @ApiProperty({
    example: 'https://api.locker-system.com/lockers/LKR-001/close',
    description: 'API endpoint to close the locker',
  })
  @IsString()
  @IsNotEmpty()
  closeUrl: string;

  @ApiProperty({
    example: 'IN_USE',
    description: 'Current status of the locker',
  })
  @IsEnum(LockerStatusVO)
  status: LockerStatusVO;

  @ApiProperty({
    example: 'OPEN',
    description: 'Current door state of the locker',
  })
  @IsEnum(DoorStateVO)
  doorState: DoorStateVO;

  static toDomain(
    id: Uuid,
    dto: LockerUpdateRequestDto,
  ): Omit<Locker, 'createdAt' | 'updatedAt'> {
    return {
      id,
      ...dto,
    };
  }
}
