import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, Min } from 'class-validator';
import { Gender } from 'src/modules/user/domain/gender';

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
  @Min(0)
  age: number;

  @ApiProperty({
    type: 'string',
    description:
      'Gender of the person in the image, used for additional verification',
    example: 'MALE',
  })
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(Gender)
  gender: Gender;
}
