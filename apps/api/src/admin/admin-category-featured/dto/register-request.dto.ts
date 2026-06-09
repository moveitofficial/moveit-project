import { ApiProperty } from '@nestjs/swagger';
import { ServiceGroupName } from '@prisma/client';
import { ArrayMaxSize, ArrayMinSize, IsEnum, IsUUID } from 'class-validator';

export class RegisterCategoryFeaturedDto {
  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
    description: '등록할 서비스 그룹',
  })
  @IsEnum(ServiceGroupName)
  declare serviceGroup: ServiceGroupName;

  @ApiProperty({
    type: [String],
    format: 'uuid',
    example: ['service-uuid-1', 'service-uuid-2'],
    description: '등록할 service.id 배열',
  })
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @IsUUID('all', { each: true })
  declare serviceIds: string[];
}
