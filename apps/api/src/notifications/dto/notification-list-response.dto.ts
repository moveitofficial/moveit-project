import { ApiProperty } from '@nestjs/swagger';

import { NotificationItemDto } from './notification-item.dto';

export class NotificationListResponseDto {
  @ApiProperty({ type: [NotificationItemDto] })
  declare items: NotificationItemDto[];

  @ApiProperty({ example: true })
  declare hasNext: boolean;
}
