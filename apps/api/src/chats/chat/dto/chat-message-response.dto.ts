import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageType, OrderStatus, SystemMessageType } from '@prisma/client';

export class RoomCurrentServiceResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '프로팀의 앱개발 센스있는 디자인+개발' })
  declare title: string;

  @ApiProperty({ example: 7_700_000 })
  declare servicePrice: number;
}

export class RoomOrderResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.NEGOTIATING })
  declare status: OrderStatus;

  @ApiProperty({ example: 80_000_000 })
  declare agreedServicePrice: number;

  @ApiProperty({ example: 8_000_000 })
  declare platformFee: number;

  @ApiProperty({ example: 88_000_000 })
  declare totalAmount: number;

  @ApiProperty()
  declare startDate: Date;

  @ApiPropertyOptional({ nullable: true, example: null })
  declare endDate: Date | null;
}

export class RoomInfoResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ type: RoomCurrentServiceResponseDto })
  declare currentService: RoomCurrentServiceResponseDto;

  @ApiPropertyOptional({ type: RoomOrderResponseDto, nullable: true })
  declare order: RoomOrderResponseDto | null;
}

export class ChatMessageListResponseDto {
  @ApiProperty({ type: RoomInfoResponseDto })
  declare room: RoomInfoResponseDto;

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
    example: 'https://bucket.s3.region.amazonaws.com/chat/uuid/file.pdf',
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

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  declare senderId: string | null;

  @ApiProperty({ enum: MessageType, example: MessageType.FILE })
  declare type: MessageType;

  @ApiPropertyOptional({
    enum: SystemMessageType,
    nullable: true,
    example: null,
  })
  declare systemType: SystemMessageType | null;

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    nullable: true,
    example: null,
    description: '연관 주문 ID',
  })
  declare orderId: string | null;

  @ApiProperty({ example: '안녕하세요' })
  declare content: string;

  @ApiProperty()
  declare createdAt: Date;

  @ApiProperty({ type: [MessageAttachmentResponseDto] })
  declare attachments: MessageAttachmentResponseDto[];
}
