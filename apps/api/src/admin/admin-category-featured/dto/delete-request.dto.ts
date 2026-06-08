import { ApiProperty } from '@nestjs/swagger';
import { ServiceGroupName } from '@prisma/client';
import { ArrayMinSize, IsEnum, IsUUID } from 'class-validator';

export class DeleteCategoryFeaturedDto {
  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
    description: '삭제 대상이 속한 서비스 그룹',
  })
  @IsEnum(ServiceGroupName)
  declare serviceGroup: ServiceGroupName;

  @ApiProperty({
    type: [String],
    format: 'uuid',
    example: ['featured-uuid-1', 'featured-uuid-2'],
    description: '삭제할 CategoryFeaturedService row ID 배열',
  })
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  declare categoryFeaturedIds: string[];
}
