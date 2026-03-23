import { ICommand } from '@nestjs/cqrs';

export class SessionCICOFaceCommand implements ICommand {
  constructor(public readonly faceVector: number[]) {}
}
