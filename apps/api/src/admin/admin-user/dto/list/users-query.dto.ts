import { ApiPropertyOptional } from '@nestjs/swagger';
import { AuthProvider, Region, Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetUsersQueryDto {
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

  @ApiPropertyOptional({ enum: AuthProvider, description: '가입경로 필터' })
  @IsOptional()
  @IsEnum(AuthProvider)
  declare provider: AuthProvider | undefined;

  @ApiPropertyOptional({ enum: Region, description: '지역 필터' })
  @IsOptional()
  @IsEnum(Region)
  declare region: Region | undefined;

  @ApiPropertyOptional({
    type: String,
    example: '조한준',
    description: '이름 또는 이메일 부분 일치(대소문자 무시)',
  })
  @IsOptional()
  @IsString()
  declare search: string | undefined;
}
