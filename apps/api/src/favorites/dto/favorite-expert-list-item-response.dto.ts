import { ApiProperty } from '@nestjs/swagger';
import { ServiceGroupName, TechStackName } from '@prisma/client';

export class FavoriteExpertListItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '코드잇 에이전시' })
  declare companyName: string;

  @ApiProperty({ example: '202005' })
  declare foundedYear: number | null;

  @ApiProperty({ nullable: true, example: 'https://...' })
  declare profileImageUrl: string | null;

  @ApiProperty({
    enum: TechStackName,
    isArray: true,
    example: [TechStackName.REACT],
  })
  declare techStacks: TechStackName[];

  @ApiProperty({
    enum: ServiceGroupName,
    isArray: true,
    example: [ServiceGroupName.IT_COACHING],
  })
  declare serviceGroups: ServiceGroupName[];

  @ApiProperty({ example: 4.9 })
  declare rating: number;

  @ApiProperty({ example: 328 })
  declare reviewCount: number;
}
