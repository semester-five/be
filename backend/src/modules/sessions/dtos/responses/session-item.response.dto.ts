import { ApiProperty } from '@nestjs/swagger';

export class SessionItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  lockerCode: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  authMethod: string;

  @ApiProperty()
  checkInAt: Date;

  @ApiProperty({ nullable: true })
  checkOutAt: Date | null;

  static fromDomain(
    id: string,
    lockerCode: string,
    status: string,
    authMethod: string,
    checkInAt: Date,
    checkOutAt: Date | null,
  ): SessionItemDto {
    const dto = new SessionItemDto();
    dto.id = id;
    dto.lockerCode = lockerCode;
    dto.status = status;
    dto.authMethod = authMethod;
    dto.checkInAt = checkInAt;
    dto.checkOutAt = checkOutAt;
    return dto;
  }
}
