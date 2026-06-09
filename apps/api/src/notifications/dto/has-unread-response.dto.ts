import { ApiProperty } from '@nestjs/swagger';

export class HasUnreadResponseDto {
  @ApiProperty({ example: true })
  declare hasUnread: boolean;
}
