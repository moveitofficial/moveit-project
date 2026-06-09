import { ApiProperty } from '@nestjs/swagger';
import { ReportReason } from '@prisma/client';

class ReportUserRefDto {
  @ApiProperty({
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  declare id: string;

  @ApiProperty({ type: String, nullable: true, example: 'DevLydia' })
  declare name: string | null;
}

export class ReportDetailResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  declare id: string;

  @ApiProperty({ type: ReportUserRefDto })
  declare reporter: ReportUserRefDto; // 나를 신고한 사람

  @ApiProperty({ type: ReportUserRefDto })
  declare reported: ReportUserRefDto; //내가 신고한 대상

  @ApiProperty({ enum: ReportReason, example: ReportReason.FALSE_INFORMATION })
  declare reason: ReportReason;

  @ApiProperty({
    example:
      '욕설을 너무하고 일정내 작업을 하지않습니다. 그리고 추가 적으로 자꾸 비용처리합니다.',
  })
  declare detail: string;

  @ApiProperty({
    type: [String],
    example: [
      'https://cdn.example.com/reports/abc-1.png',
      'https://cdn.example.com/reports/abc-2.png',
    ],
  })
  declare images: string[];
}
