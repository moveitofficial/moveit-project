import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WithdrawDataDto {
  @ApiProperty({ example: true })
  declare isDeleted: boolean;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
  declare deletedAt: Date | null;
}
