import { Injectable } from '@nestjs/common';
import { IFaceRecognitionService } from 'src/modules/face-recognition/interfaces/face-recognition.interface';

@Injectable()
export class FaceRecognitionService implements IFaceRecognitionService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getFaceVector(_image: Buffer): Promise<number[]> {
    return await Promise.resolve(
      Array(128)
        .fill(0)
        .map(() => Math.random()),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async verifyFace(_image: Buffer, _storedVector: number[]): Promise<number> {
    return await Promise.resolve(0.95);
  }
}
