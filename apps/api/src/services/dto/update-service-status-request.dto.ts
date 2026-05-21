import { ApiProperty } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';
import { IsIn } from 'class-validator';

export class UpdateServiceStatusRequestDto {
  @ApiProperty({
    enum: [ServiceStatus.ACTIVE, ServiceStatus.PAUSED],
    example: ServiceStatus.PAUSED,
    description: '서비스 노출 상태 (ACTIVE / PAUSED)',
  })
  @IsIn([ServiceStatus.ACTIVE, ServiceStatus.PAUSED])
  declare status: ServiceStatus;
}
