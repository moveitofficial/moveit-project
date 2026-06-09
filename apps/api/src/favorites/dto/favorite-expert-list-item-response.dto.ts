import { ApiProperty } from '@nestjs/swagger';
import { TechStackName } from '@prisma/client';

export class FavoriteExpertListItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '코드잇 에이전시' })
  declare name: string;

  @ApiProperty({ example: '코드잇 에이전시' })
  declare companyName: string;

  @ApiProperty({ nullable: true, example: 'https://...' })
  declare profileImageUrl: string | null;

  @ApiProperty({
    enum: TechStackName,
    isArray: true,
    example: [TechStackName.REACT],
  })
  declare techStacks: TechStackName[];

  @ApiProperty({ example: 4.9 })
  declare rating: number;

  @ApiProperty({ example: 328 })
  declare reviewCount: number;
}
