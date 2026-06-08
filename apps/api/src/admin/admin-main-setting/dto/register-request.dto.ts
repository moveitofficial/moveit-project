import { ApiProperty } from '@nestjs/swagger';
import { MainSectionType } from '@prisma/client';
import { ArrayMaxSize, ArrayMinSize, IsEnum, IsUUID } from 'class-validator';

export class RegisterMainSettingDto {
  @ApiProperty({
    enum: MainSectionType,
    example: MainSectionType.POPULAR_IT_COACHING,
    description: '등록할 섹션 타입',
  })
  @IsEnum(MainSectionType)
  declare sectionType: MainSectionType;

  @ApiProperty({
    type: [String],
    format: 'uuid',
    example: ['service-uuid-1', 'service-uuid-2'],
    description:
      '등록할 대상 ID 배열. 서비스 섹션이면 service.id, 전문가 섹션이면 user.id. 한 호출에 한 섹션만',
  })
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @IsUUID('all', { each: true })
  declare targetIds: string[];
}
