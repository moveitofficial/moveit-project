import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsUUID } from 'class-validator';

export class DeleteBannerDto {
  @ApiProperty({
    type: [String],
    format: 'uuid',
    example: ['banner-uuid-1'],
    description: '삭제할 띠배너 ID 배열',
  })
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  declare bannerIds: string[];
}
