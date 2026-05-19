import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceCategoryName, ServiceGroupName } from '@prisma/client';

class InterestCategoryResponseDto {
  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
  })
  declare group: ServiceGroupName;

  @ApiProperty({ enum: ServiceCategoryName, example: ServiceCategoryName.WEB })
  declare category: ServiceCategoryName;
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
