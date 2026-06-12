import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class NotificationClientUserDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiPropertyOptional({ example: 'https://example.png' })
  declare profileImageUrl: string | null;

  @ApiPropertyOptional({
    example: '홍길동',
    description: '닉네임 (없으면 이름)',
  })
  declare nickname: string | null;
}

class NotificationExpertUserDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiPropertyOptional({ example: 'https://example.png' })
  declare profileImageUrl: string | null;

  @ApiPropertyOptional({ example: '무빗컴퍼니' })
  declare businessName: string | null;
}

class NotificationLastMessageDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '안녕하세요' })
  declare content: string;

  @ApiProperty()
  declare createdAt: Date;
}

export class ChatNotificationResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ format: 'uuid' })
  declare currentServiceId: string;

  @ApiProperty({ type: NotificationClientUserDto })
  declare clientUser: NotificationClientUserDto;

  @ApiProperty({ type: NotificationExpertUserDto })
  declare expertUser: NotificationExpertUserDto;

  @ApiPropertyOptional({ type: NotificationLastMessageDto })
  declare lastMessage: NotificationLastMessageDto | null;
}
