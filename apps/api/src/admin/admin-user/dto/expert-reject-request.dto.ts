import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ExpertRejectRequestDto {
  @ApiProperty({
    example: '제출하신 사업자등록증을 확인할 수 없습니다.',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  declare rejectReason: string;
}
