export interface IFaceRecognitionService {
  getFaceVector(image: Buffer): Promise<number[]>;
  verifyFace(image: Buffer, storedVector: number[]): Promise<number>;
}
