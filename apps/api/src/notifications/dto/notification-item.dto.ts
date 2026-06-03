import { ApiProperty } from '@nestjs/swagger';
import {
  NotificationCategory,
  NotificationType,
  ReferenceType,
} from '@prisma/client';

export class NotificationItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: NotificationType })
  declare type: NotificationType;

  @ApiProperty({ enum: NotificationCategory })
  declare category: NotificationCategory;

  @ApiProperty({ example: '결제가 완료되었어요' })
  declare content: string;

  @ApiProperty({ enum: ReferenceType, nullable: true })
  declare referenceType: ReferenceType | null;

  @ApiProperty({ type: String, format: 'uuid', nullable: true })
  declare referenceId: string | null;

  @ApiProperty({ example: false })
  declare isRead: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  declare createdAt: Date;
}
