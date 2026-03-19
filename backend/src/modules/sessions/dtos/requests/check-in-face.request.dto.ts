import { ApiProperty } from '@nestjs/swagger';

export class CheckInFaceRequestDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  faceImage: Express.Multer.File;
}
