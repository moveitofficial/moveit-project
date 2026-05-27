import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateServiceRequestDto } from './create-service-request.dto';

export class UpdateServiceRequestDto extends PartialType(
  OmitType(CreateServiceRequestDto, ['serviceId'] as const),
) {}
