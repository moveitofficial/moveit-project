import { ApiProperty } from '@nestjs/swagger';

export class SummaryResponseDataDto {
  @ApiProperty({ example: 8, description: '전문가 신청' })
  declare expertApplications: number;

  @ApiProperty({ example: 2, description: '신고 접수' })
  declare reports: number;

  @ApiProperty({ example: 12, description: '정산 요청' })
  declare settlements: number;

  @ApiProperty({ example: 32, description: '서비스 진행중' })
  declare ongoingServices: number;
}
