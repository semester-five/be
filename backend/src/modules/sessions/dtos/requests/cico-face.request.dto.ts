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

  @ApiProperty({
    type: 'number',
    description:
      'The age of the person in the image, used for additional verification',
    example: 25,
  })
  age: number;

  @ApiProperty({
    type: 'string',
    description:
      'Gender of the person in the image, used for additional verification',
    example: 'male',
  })
  gender: string;
}
