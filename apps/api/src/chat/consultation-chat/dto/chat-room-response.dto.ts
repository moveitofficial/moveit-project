import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ClientUserDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiPropertyOptional({ example: 'http://example.png' })
  declare profileImageUrl: string | null;

  @ApiPropertyOptional({
    example: '홍길동',
    description: '닉네임 (없으면 이름)',
  })
  declare nickname: string | null;
}

class ExpertUserDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiPropertyOptional({ example: 'http://example.png' })
  declare profileImageUrl: string | null;

  @ApiPropertyOptional({ example: '무빗컴퍼니' })
  declare businessName: string | null;
}

class LastMessageDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '안녕하세요' })
  declare content: string;

  @ApiProperty()
  declare createdAt: Date;
}

export class ChatRoomResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ format: 'uuid' })
  declare currentServiceId: string;

  @ApiProperty({ type: ClientUserDto })
  declare clientUser: ClientUserDto;

  @ApiProperty({ type: ExpertUserDto })
  declare expertUser: ExpertUserDto;

  @ApiPropertyOptional({ type: LastMessageDto })
  declare lastMessage: LastMessageDto | null;

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    description: '내가 마지막으로 읽은 메시지 ID',
    nullable: true,
  })
  declare myLastReadMessageId: string | null;

  @ApiProperty()
  declare createdAt: Date;
}
