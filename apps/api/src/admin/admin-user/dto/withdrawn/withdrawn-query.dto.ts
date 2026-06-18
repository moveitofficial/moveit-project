import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetWithdrawnQueryDto {
  @ApiPropertyOptional({
    enum: Role,
    example: Role.CLIENT,
    default: Role.CLIENT,
    description: '일반(CLIENT) / 판매자(EXPERT) 탭 구분. 미지정 시 CLIENT',
  })
  @IsOptional()
  @IsEnum(Role)
  declare role: Role | undefined;

  @ApiPropertyOptional({ type: Number, example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare page: number | undefined;

  @ApiPropertyOptional({ type: Number, example: 50, default: 50, maximum: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  declare pageSize: number | undefined;

  @ApiPropertyOptional({
    type: String,
    example: '조한준',
    description: '이름 또는 이메일 부분 일치 (대소문자 무시)',
  })
  @IsOptional()
  @IsString()
  declare search: string | undefined;
}
