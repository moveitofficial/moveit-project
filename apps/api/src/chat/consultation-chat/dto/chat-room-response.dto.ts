import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ClientProfileDto {
  @ApiProperty({ example: '의뢰인입니다' })
  declare nickname?: string;
}

class ExpertProfileDto {
  @ApiProperty({ example: '의뢰인입니다' })
  declare businessName: string;
}

class ClientUserDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: 'http://example.png' })
  declare profileImageUrl?: string;

  @ApiProperty({ type: ClientProfileDto })
  declare clientNickname: ClientProfileDto;
}

class ExpertUserDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: 'http://example.png' })
  declare profileImageUrl?: string;

  @ApiProperty({ type: ExpertProfileDto })
  declare clientNickname: ExpertProfileDto;
}

class LastMessageDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ format: 'uuid' })
  declare senderId: string;

  @ApiProperty({ example: '안녕하세요' })
  declare content: string;

  @ApiProperty()
  declare createdAt: Date;
}

export class ChatRoomResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ format: 'uuid' })
  declare clientUserId: string;

  @ApiProperty({ format: 'uuid' })
  declare expertUserId: string;

  @ApiProperty({ format: 'uuid' })
  declare currentServiceId: string;

  @ApiPropertyOptional({ type: LastMessageDto })
  declare lastMessage: LastMessageDto | null;

  @ApiProperty()
  declare createdAt: Date;
}
