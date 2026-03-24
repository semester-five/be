import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export class NotificationCreateRequest {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  eventCode: string;

  @IsObject()
  params: Record<string, any>;
}
