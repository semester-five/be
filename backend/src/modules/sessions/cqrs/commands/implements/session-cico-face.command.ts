import { ICommand } from '@nestjs/cqrs';

export class SessionCICOFaceCommand implements ICommand {
  constructor(
    public readonly faceVector: number[],
    public readonly age: number | null,
    public readonly gender: string | null,
  ) {}
}
