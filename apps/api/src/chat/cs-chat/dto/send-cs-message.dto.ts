import { MessageType } from '@prisma/client';
import { IsEnum, IsString, IsUUID, MinLength } from 'class-validator';

export class SendCSMessageDto {
  @IsUUID()
  declare roomId: string;

  @IsEnum(MessageType)
  declare type: MessageType;

  @IsString()
  @MinLength(1)
  declare content: string;
}
