import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CsChatStatus } from '@prisma/client';

class CsRoomLastMessageDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '안녕하세요' })
  declare content: string;

  @ApiProperty()
  declare createdAt: Date;
}

class CsRoomAssignedAdminDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '홍길동' })
  declare name: string;
}

class CsRoomUserDto {
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

export class CsUserRoomResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: CsChatStatus })
  declare status: CsChatStatus;

  @ApiPropertyOptional({ type: CsRoomLastMessageDto })
  declare lastMessage: CsRoomLastMessageDto | null;

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

export class CsAdminRoomResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: CsChatStatus })
  declare status: CsChatStatus;

  @ApiProperty({ type: CsRoomUserDto })
  declare user: CsRoomUserDto;

  @ApiPropertyOptional({ type: CsRoomAssignedAdminDto })
  declare assignedAdmin: CsRoomAssignedAdminDto | null;

  @ApiPropertyOptional({ type: CsRoomLastMessageDto })
  declare lastMessage: CsRoomLastMessageDto | null;

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
