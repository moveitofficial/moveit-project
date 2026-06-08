import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsUUID } from 'class-validator';

export class DeleteFaqDto {
  @ApiProperty({
    type: [String],
    format: 'uuid',
    example: ['faq-uuid-1', 'faq-uuid-2'],
    description: '삭제할 FAQ id 배열 (체크박스 다중 선택)',
  })
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  declare ids: string[];
}
