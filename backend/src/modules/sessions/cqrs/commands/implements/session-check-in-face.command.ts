import { ICommand } from '@nestjs/cqrs';

export class SessionCheckInFaceCommand implements ICommand {
  constructor(public readonly faceImage: Express.Multer.File) {}
}
