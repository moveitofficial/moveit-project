import { ApiProperty } from '@nestjs/swagger';
import {
  OrderStatus,
  ServiceCategoryName,
  ServiceGroupName,
} from '@prisma/client';

class OrdersListClientDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ type: String, nullable: true, example: '조한준' })
  declare name: string | null;
}

class OrdersListExpertDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ type: String, nullable: true, example: '코드잇에이전시' })
  declare businessName: string | null;
}

class OrdersListServiceDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '프로팀의 앱개발 센스있는 디자인+개발 합니다.' })
  declare title: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'https://cdn.example.com/svc/abc.png',
  })
  declare thumbnailUrl: string | null;

  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
  })
  declare categoryGroup: ServiceGroupName;

  @ApiProperty({
    enum: ServiceCategoryName,
    example: ServiceCategoryName.APP,
  })
  declare categoryName: ServiceCategoryName;
}

export class OrderItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.IN_PROGRESS })
  declare status: OrderStatus;

  @ApiProperty({ example: 80_000_000 })
  declare totalAmount: number;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  declare startDate: Date | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  declare endDate: Date | null;

  @ApiProperty({ type: OrdersListClientDto })
  declare client: OrdersListClientDto;

  @ApiProperty({ type: OrdersListExpertDto })
  declare expert: OrdersListExpertDto;

  @ApiProperty({ type: OrdersListServiceDto })
  declare service: OrdersListServiceDto;
}
