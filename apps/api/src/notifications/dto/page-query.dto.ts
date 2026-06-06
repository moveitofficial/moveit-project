import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import { NotificationTab } from '../notification-tab.enum';

export class NotificationsPageQueryDto {
  @ApiProperty({ enum: NotificationTab, example: NotificationTab.TRANSACTION })
  @IsEnum(NotificationTab)
  declare tab: NotificationTab;

  @ApiPropertyOptional({ type: Number, example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare page: number | undefined;
}
