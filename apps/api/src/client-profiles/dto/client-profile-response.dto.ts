import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class InterestCategoryResponseDto {
  @ApiProperty({ example: 'b3e57c2a-e64b-47c7-99dd-a174ca2d4dac' })
  declare id: string;

  @ApiProperty({ example: '2b25c45a-5c87-4caa-8872-34b501452c23' })
  declare serviceGroupId: string;

  @ApiProperty({ example: 'b3e57c2a-e64b-47c7-99dd-a174ca2d4dac' })
  declare serviceCategoryId: string;
}

export class ClientProfileResponseDto {
  @ApiProperty({ example: 'c4685ba9-fa20-4922-aa17-265b354ae844' })
  declare id: string;

  @ApiProperty({ example: '7656a3d3-c608-413a-936a-73362085bd1f' })
  declare userId: string;

  @ApiPropertyOptional({ example: '한준님축지법쓰신다' })
  declare nickname: string | null;

  @ApiProperty({ type: [InterestCategoryResponseDto] })
  declare interestCategories: InterestCategoryResponseDto[];
}

export class ClientProfileHttpResponseDto {
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: '요청 성공' })
  declare message: string;

  @ApiProperty({ type: ClientProfileResponseDto })
  declare data: ClientProfileResponseDto;
}
