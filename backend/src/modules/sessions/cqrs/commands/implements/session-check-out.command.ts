import { ICommand } from '@nestjs/cqrs';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';

export class SessionCheckOutCommand implements ICommand {
  constructor(
    public readonly sessionId: Uuid,
    public readonly faceImage?: Express.Multer.File,
    public readonly qrToken?: string,
  ) {}
}
