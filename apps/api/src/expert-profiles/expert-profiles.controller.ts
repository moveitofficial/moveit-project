import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { COMMON_ERRORS } from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';

import { BusinessNumberCheckResponseDto } from './dto/expert-profile-response.dto';
import { ExpertProfilesService } from './expert-profiles.service';

class BusinessNumberQuery {
  @IsString()
  declare value: string;
}

@ApiTags('expert-profiles')
@Controller('expert-profiles')
export class ExpertProfilesController {
  constructor(private readonly expertProfilesService: ExpertProfilesService) {}

  @ApiOperation({ summary: '사업자번호 중복 확인' })
  @ApiQuery({
    name: 'value',
    description: '확인할 사업자번호',
    example: '1234567890',
  })
  @ApiSuccessResponse(HttpStatus.OK, BusinessNumberCheckResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('/business-number/check')
  checkBusinessNumber(@Query() query: BusinessNumberQuery) {
    return this.expertProfilesService.checkBusinessNumber(query.value);
  }
}
