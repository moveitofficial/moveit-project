import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ example: 1 })
  declare page: number;

  @ApiProperty({ example: 20 })
  declare pageSize: number;

  @ApiProperty({ example: 100 })
  declare totalCount: number;

  @ApiProperty({ example: true })
  declare hasNext: boolean;
}
