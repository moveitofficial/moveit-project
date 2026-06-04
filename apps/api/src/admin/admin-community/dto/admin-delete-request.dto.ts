import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class AdminDeleteRequestDto {
  @ApiProperty({
    example: '부적절한 글이 포함되어 있어서 삭제 하였습니다.',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  declare deleteReason: string;
}
