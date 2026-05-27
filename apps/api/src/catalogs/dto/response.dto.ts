import { ApiProperty } from '@nestjs/swagger';
import {
  ServiceCategoryName,
  ServiceGroupName,
  TechStackName,
} from '@prisma/client';

class ServiceGroupItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
  })
  declare name: ServiceGroupName;
}

class ServiceGroupListDataDto {
  @ApiProperty()
  declare count: number;

  @ApiProperty({ type: [ServiceGroupItemDto] })
  declare items: ServiceGroupItemDto[];
}

export class ServiceGroupListResponseDto {
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: '요청 성공' })
  declare message: string;

  @ApiProperty({ type: ServiceGroupListDataDto })
  declare data: ServiceGroupListDataDto;
}

class ServiceCategoryItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: ServiceCategoryName, example: ServiceCategoryName.WEB })
  declare name: ServiceCategoryName;
}

class ServiceCategoryListDataDto {
  @ApiProperty()
  declare count: number;

  @ApiProperty({ type: [ServiceCategoryItemDto] })
  declare items: ServiceCategoryItemDto[];
}

export class ServiceCategoryListResponseDto {
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: '요청 성공' })
  declare message: string;

  @ApiProperty({ type: ServiceCategoryListDataDto })
  declare data: ServiceCategoryListDataDto;
}

class TechStackItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: TechStackName, example: TechStackName.TYPESCRIPT })
  declare name: TechStackName;
}

class TechStackListDataDto {
  @ApiProperty()
  declare count: number;

  @ApiProperty({ type: [TechStackItemDto] })
  declare items: TechStackItemDto[];
}

export class TechStackListResponseDto {
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: '요청 성공' })
  declare message: string;

  @ApiProperty({ type: TechStackListDataDto })
  declare data: TechStackListDataDto;
}
