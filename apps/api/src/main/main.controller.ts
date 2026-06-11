import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { COMMON_ERRORS } from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';

import { MainSectionsResponseDto } from './dto/main-sections-response.dto';
import { MainService } from './main.service';

@ApiTags('main')
@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @ApiOperation({
    summary: '메인 페이지 어드민 큐레이션 + 띠배너',
    description:
      '어드민이 등록한 6개 섹션(인기/추천 IT코칭·프로젝트, MOVIT 인기 코칭·전문가)과 띠배너 1개를 한 번에 반환. 띠배너 없으면 null.',
  })
  @ApiSuccessResponse(HttpStatus.OK, MainSectionsResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('sections')
  getSections(): Promise<MainSectionsResponseDto> {
    return this.mainService.getSections();
  }
}
