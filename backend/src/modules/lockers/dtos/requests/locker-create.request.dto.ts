import { ApiProperty } from '@nestjs/swagger';
import { LockerSizeVO } from '../../value-objects/locker-size.vo';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LockerStatusVO } from '../../value-objects/locker-status.vo';
import { DoorStateVO } from '../../value-objects/door-state.vo';
import { Locker } from '../../domain/lockers';

export class LockerCreateRequestDto {
  @ApiProperty({
    example: 'LKR-001',
    description: 'Unique code for the locker',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    example: 'First Floor - East Wing',
    description: 'Location of the locker',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    example: 'SMALL',
    default: 'SMALL',
    description: 'Size of the locker (e.g., SMALL, MEDIUM, LARGE)',
  })
  @IsNotEmpty()
  @IsEnum(LockerSizeVO)
  size: LockerSizeVO;

  @ApiProperty({
    example: 'https://api.example.com/lockers/LKR-001/open',
    description: 'API endpoint to open the locker',
  })
  @IsNotEmpty()
  @IsString()
  openUrl: string;

  @ApiProperty({
    example: 'https://api.example.com/lockers/LKR-001/close',
    description: 'API endpoint to close the locker',
  })
  @IsNotEmpty()
  @IsString()
  closeUrl: string;

  @ApiProperty({
    example: 'IN_USE',
    description: 'Current status of the locker',
  })
  @IsNotEmpty()
  @IsEnum(LockerStatusVO)
  status: LockerStatusVO;

  @ApiProperty({
    example: 'OPEN',
    description: 'Current door state of the locker',
  })
  @IsNotEmpty()
  @IsEnum(DoorStateVO)
  doorState: DoorStateVO;

  static toDomain(dto: LockerCreateRequestDto): Locker {
    return Locker.create({
      code: dto.code,
      location: dto.location,
      size: dto.size,
      openUrl: dto.openUrl,
      closeUrl: dto.closeUrl,
      status: dto.status,
      doorState: dto.doorState,
    });
  }
}
