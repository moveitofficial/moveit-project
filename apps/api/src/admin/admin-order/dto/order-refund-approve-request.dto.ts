import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class OrderRefundApproveRequestDto {
  @ApiProperty({
    example: '업체 일정 만료로 인해 전액환불',
    description: '관리자 승인 사유 (1~500자, 필수)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  declare reason: string;
}
