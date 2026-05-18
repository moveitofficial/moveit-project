import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class WithdrawDataDto {
  @ApiProperty({ example: true })
  declare isDeleted: boolean;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
  declare deletedAt: Date | null;
}

export class WithdrawHttpResponseDto {
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: '요청 성공' })
  declare message: string;

  @ApiProperty({ type: WithdrawDataDto })
  declare data: WithdrawDataDto;
}
