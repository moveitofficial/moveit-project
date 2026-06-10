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

export class MessageAttachmentResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({
    example:
      'https://bucket.s3.region.amazonaws.com/consultation/uuid/file.pdf',
  })
  declare fileUrl: string;

  @ApiProperty({ example: '기획서.pdf' })
  declare fileName: string;

  @ApiProperty({ example: 'application/pdf' })
  declare fileType: string;

  @ApiProperty({ example: 204_800 })
  declare fileSize: number;
}

export class ChatMessageResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ format: 'uuid' })
  declare chatRoomId: string;

  @ApiProperty({ format: 'uuid' })
  declare senderId: string;

  @ApiProperty({ enum: MessageType, example: MessageType.FILE })
  declare type: MessageType;

  @ApiPropertyOptional({
    enum: SystemMessageType,
    nullable: true,
    example: null,
  })
  declare systemType: SystemMessageType | null;

  @ApiPropertyOptional({
    enum: MessageReferenceType,
    nullable: true,
    example: null,
  })
  declare referenceType: MessageReferenceType | null;

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    nullable: true,
    example: null,
  })
  declare referenceId: string | null;

  @ApiProperty({ example: '안녕하세요' })
  declare content: string;

  @ApiProperty()
  declare createdAt: Date;

  @ApiProperty({ type: [MessageAttachmentResponseDto] })
  declare attachments: MessageAttachmentResponseDto[];
}
