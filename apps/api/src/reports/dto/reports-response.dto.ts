import { ApiProperty } from '@nestjs/swagger';
import { ReportReason, ReportStatus } from '@prisma/client';

export class ReportsResponseDto {
  @ApiProperty({ format: 'uuid', description: '신고 ID' })
  declare id: string;

  @ApiProperty({
    enum: ReportReason,
    example: ReportReason.ABUSE,
    description: '신고 사유',
  })
  declare reason: ReportReason;

  @ApiProperty({
    description: '신고 상세 내용',
    example: '욕설과 비방을 일삼고 있습니다.',
  })
  declare detail: string;

  @ApiProperty({
    type: [String],
    example: ['https://example.com/reports.png'],
    description: '증거 이미지 URL 목록',
  })
  declare imageUrls: string[];

  @ApiProperty({
    enum: ReportStatus,
    example: ReportStatus.PENDING,
    description: '신고 처리 상태',
  })
  declare status: ReportStatus;

  @ApiProperty({
    example: '2026-01-10T09:00:00.000Z',
    description: '신고 접수 일시',
  })
  declare createdAt: Date;
}
