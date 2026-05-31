import { ApiProperty } from '@nestjs/swagger';
import { ReportReason } from '@prisma/client';

class ReportReporterRefDto {
  @ApiProperty({
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  declare id: string;

  @ApiProperty({ type: String, nullable: true, example: 'DevLydia' })
  declare name: string | null;
}

export class UserReportReceivedItemDto {
  @ApiProperty({
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  declare id: string;

  @ApiProperty({ type: ReportReporterRefDto })
  declare reporter: ReportReporterRefDto;

  @ApiProperty({ example: '신고 상세 내용입니다.' })
  declare detail: string;

  @ApiProperty({ enum: ReportReason, example: ReportReason.ABUSE })
  declare reason: ReportReason;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2024-05-29T00:00:00.000Z',
  })
  declare createdAt: Date;
}
