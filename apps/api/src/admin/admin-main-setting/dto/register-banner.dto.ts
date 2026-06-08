import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class RegisterBannerDto {
  @ApiProperty({
    example: 'https://moveit.kr/events/2026-summer',
    description: '띠배너 클릭 시 이동할 URL',
  })
  @IsUrl()
  declare actionUrl: string;
}
