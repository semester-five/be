import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CICOFaceRequestDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'number',
    },
    description: 'Face vector extracted from the uploaded image',
    example: [0.1, 0.2, 0.3, 0.4, 0.5],
  })
  @IsNotEmpty()
  faceVector: number[] = [];
}
