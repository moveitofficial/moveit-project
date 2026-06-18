import { ApiProperty } from '@nestjs/swagger';
import { ReportReason } from '@prisma/client';

class ReportUserDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'DevLydia',
    description: '유저 이름',
  })
  declare name: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '코드잇에이전시',
    description: '판매자(EXPERT) 면 회사명, 그 외 null',
  })
  declare businessName: string | null;
}

export class ReportItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({
    enum: ReportReason,
    example: ReportReason.OTHER,
    description:
      'FALSE_INFORMATION=허위·과장 정보, ABUSE=욕설·비방, ILLEGAL_ACTIVITY=불법 행위/사기 의심, EXTERNAL_CONTACT=외부 연락처 유도, SPAM=스팸/광고, OTHER=기타',
  })
  declare reason: ReportReason;

  @ApiProperty({
    example: '신고 내역입니다. 신고내역입니다.',
    description: '신고 상세 내용 (풀 텍스트)',
  })
  declare detail: string;

  @ApiProperty({
    example: '2024-05-29T05:02:46.228Z',
    description: '신고 날짜',
  })
  declare createdAt: Date;

  @ApiProperty({ type: ReportUserDto, description: '신고한 유저' })
  declare reporter: ReportUserDto;

  @ApiProperty({ type: ReportUserDto, description: '신고 대상' })
  declare reported: ReportUserDto;
}
