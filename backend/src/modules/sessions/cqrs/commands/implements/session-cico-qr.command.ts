import { ICommand } from '@nestjs/cqrs';

export class SessionCICOQRCommand implements ICommand {
  constructor(public readonly qrToken: string) {}
}
