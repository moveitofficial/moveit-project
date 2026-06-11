import { ApiProperty } from '@nestjs/swagger';
import { ReportStatus } from '@prisma/client';

export class ReportsResponseDto {
  @ApiProperty({
    format: 'uuid',
    description: '신고 ID',
  })
  declare id: string;
  @ApiProperty({
    enum: ReportStatus,
    example: ReportStatus.PENDING,
    description: '신고 처리 상태',
  })
  declare status: ReportStatus;
}
