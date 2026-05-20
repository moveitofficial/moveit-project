import { ApiProperty } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateServiceStatusRequestDto {
  @ApiProperty({
    enum: ServiceStatus,
    example: ServiceStatus.PAUSED,
    description: '서비스 노출 상태 (ACTIVE / PAUSED / CLOSED)',
  })
  @IsEnum(ServiceStatus)
  declare status: ServiceStatus;
}
