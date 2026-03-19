import { ICommand } from '@nestjs/cqrs';

export class SessionCheckInQRCommand implements ICommand {
  constructor(public readonly qrToken: string) {}
}
