import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MessageReferenceType,
  MessageType,
  SystemMessageType,
} from '@prisma/client';

export class ChatMessageResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ format: 'uuid' })
  declare chatRoomId: string;

  @ApiProperty({ format: 'uuid' })
  declare senderId: string;

  @ApiProperty({ enum: MessageType })
  declare type: MessageType;

  @ApiPropertyOptional({ enum: SystemMessageType })
  declare systemType: SystemMessageType | null;

  @ApiPropertyOptional({ enum: MessageReferenceType })
  declare referenceType: MessageReferenceType | null;

  @ApiPropertyOptional({ format: 'uuid' })
  declare referenceId: string | null;

  @ApiProperty({ example: '안녕하세요' })
  declare content: string;

  @ApiProperty()
  declare createdAt: Date;
}
