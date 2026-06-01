import {
  MessageReferenceType,
  MessageType,
  SystemMessageType,
} from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  declare chatRoomId: string;

  @IsEnum(MessageType)
  declare type: MessageType;

  @IsOptional()
  @IsEnum(SystemMessageType)
  declare systemType?: SystemMessageType;

  @IsOptional()
  @IsEnum(MessageReferenceType)
  declare referenceType?: MessageReferenceType;

  @IsOptional()
  @IsUUID()
  declare referenceId?: string;

  @IsString()
  @MinLength(1)
  declare content: string;
}
