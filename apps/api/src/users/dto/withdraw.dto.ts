import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class WithdrawRequestDto {
  @ApiPropertyOptional({ example: '서비스를 더 이상 이용하지 않습니다.' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  declare deletionReason?: string;
}

export class WithdrawDataDto {
  @ApiProperty({ example: true })
  declare isDeleted: boolean;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
  declare deletedAt: Date | null;

  @ApiPropertyOptional({ example: '서비스를 더 이상 이용하지 않습니다.' })
  declare deletionReason: string | null;
}
