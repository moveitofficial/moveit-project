import { ApiProperty } from '@nestjs/swagger';
import { MainSectionType } from '@prisma/client';
import { ArrayMinSize, IsEnum, IsUUID } from 'class-validator';

export class DeleteMainSettingDto {
  @ApiProperty({
    enum: MainSectionType,
    example: MainSectionType.POPULAR_IT_COACHING,
    description: '삭제 대상이 속한 섹션 타입',
  })
  @IsEnum(MainSectionType)
  declare sectionType: MainSectionType;

  @ApiProperty({
    type: [String],
    format: 'uuid',
    example: ['main-setting-uuid-1', 'main-setting-uuid-2'],
    description: '삭제할 MainSetting row ID 배열 (한 섹션 안에서만)',
  })
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  declare mainSettingIds: string[];
}
