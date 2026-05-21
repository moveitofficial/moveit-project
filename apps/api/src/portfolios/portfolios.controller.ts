import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { COMMON_ERRORS } from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';

import { PortfolioResponseDto } from './dto/portfolio-response.dto';
import { PortfoliosService } from './portfolios.service';

@ApiTags('portfolios')
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @ApiOperation({ summary: '포트폴리오 조회' })
  @ApiSuccessResponse(HttpStatus.OK, PortfolioResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get(':id')
  getPortfolioDetailById(@Param('id') id: string) {
    return this.portfoliosService.findOneById(id);
  }
}
