import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  COMMON_ERRORS,
  EXPERT_ERRORS,
  SERVICE_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../common/decorators/api-success-response.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Paginated } from '../common/types/paginated.type';
import { PortfolioListResponseDto } from '../portfolios/dto/portfolio-response.dto';
import { ServiceListItemResponseDto } from '../services/dto/service-response.dto';

import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '모든 유저 조회하기' })
  @Get('')
  getAllUser() {
    return this.usersService.getAllUser();
  }

  @ApiOperation({ summary: '유저(전문가) 포트폴리오 조회하기' })
  @ApiSuccessResponse(HttpStatus.OK, PortfolioListResponseDto)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND, EXPERT_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get(':id/portfolios')
  getPortfoliosByUserId(@Param('id') userId: string) {
    return this.usersService.getUserWithPortfolios(userId);
  }

  @ApiOperation({ summary: '유저(전문가) 서비스 조회하기' })
  @ApiPaginatedResponse(HttpStatus.OK, ServiceListItemResponseDto)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND, EXPERT_ERRORS.NOT_FOUND)
  @ApiErrorResponse(SERVICE_ERRORS.FORBIDDEN_NOT_EXPERT)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get(':id/services')
  getAllServicesByUserId(
    @Param('id', ParseUUIDPipe) userID: string,
    @Query() query: PaginationQueryDto,
  ): Promise<Paginated<ServiceListItemResponseDto>> {
    return this.usersService.getUserWithServices(userID, query);
  }
}
