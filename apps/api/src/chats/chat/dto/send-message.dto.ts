import { MessageType, SystemMessageType } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  declare roomId: string;

  @IsEnum(MessageType)
  declare type: MessageType;

  @IsOptional()
  @IsEnum(SystemMessageType)
  declare systemType?: SystemMessageType;

  @IsOptional()
  @IsUUID()
  declare orderId?: string;

  @IsString()
  @MinLength(1)
  declare content: string;
}
