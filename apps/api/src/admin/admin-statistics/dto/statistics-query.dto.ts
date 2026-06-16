import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class StatisticsQueryDto {
  @ApiProperty({
    example: '2024-01-01',
    description: '조회 시작일 (YYYY-MM-DD)',
  })
  @IsDateString()
  declare startDate: string;

  @ApiProperty({
    example: '2024-01-31',
    description: '조회 종료일 (YYYY-MM-DD)',
  })
  @IsDateString()
  declare endDate: string;
}
