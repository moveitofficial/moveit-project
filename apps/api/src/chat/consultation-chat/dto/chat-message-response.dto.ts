import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MessageReferenceType,
  MessageType,
  SystemMessageType,
} from '@prisma/client';

export class ChatMessageListResponseDto {
  @ApiProperty({ type: () => [ChatMessageResponseDto] })
  declare items: ChatMessageResponseDto[];

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    description: '다음 페이지 커서 (null이면 마지막 페이지)',
    nullable: true,
  })
  declare nextCursor: string | null;
}

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

  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  declare referenceId: string | null;

  @ApiProperty({ example: '안녕하세요' })
  declare content: string;

  @ApiProperty()
  declare createdAt: Date;
}
