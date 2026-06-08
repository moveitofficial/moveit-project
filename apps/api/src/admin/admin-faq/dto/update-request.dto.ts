import { PartialType } from '@nestjs/swagger';

import { CreateFaqDto } from './create-request.dto';

export class UpdateFaqDto extends PartialType(CreateFaqDto) {}
