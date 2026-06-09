import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageType, SenderType } from '@prisma/client';

export class CsMessageListResponseDto {
  @ApiProperty({ type: () => [CsMessageResponseDto] })
  declare items: CsMessageResponseDto[];

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    description: '다음 페이지 커서 (null이면 마지막 페이지)',
    nullable: true,
  })
  declare nextCursor: string | null;
}

export class CsMessageResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ format: 'uuid' })
  declare chatRoomId: string;

  @ApiProperty({ enum: SenderType })
  declare senderType: SenderType;

  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  declare senderUserId: string | null;

  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  declare senderAdminId: string | null;

  @ApiProperty({ enum: MessageType })
  declare type: MessageType;

  @ApiProperty({ example: '안녕하세요' })
  declare content: string;

  @ApiProperty()
  declare createdAt: Date;
}
