import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  ParseUUIDPipe,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  COMMON_ERRORS,
  EXPERT_PROFILE_ERRORS,
  USER_ERRORS,
} from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../common/decorators/api-success-response.decorator';
import { AppException } from '../../common/exceptions/app.exception';
import { type Paginated } from '../../common/types/paginated.type';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';

import { AdminUserService } from './admin-user.service';
import { UserCommentItemDto } from './dto/detail/user-comments-response.dto';
import { UserDetailResponseDto } from './dto/detail/user-detail-response.dto';
import { UserOrderItemDto } from './dto/detail/user-orders-response.dto';
import { UserPostItemDto } from './dto/detail/user-posts-response.dto';
import { UserReportReceivedItemDto } from './dto/detail/user-reports-received-response.dto';
import { UserReportSentItemDto } from './dto/detail/user-reports-sent-response.dto';
import { UserServiceItemDto } from './dto/detail/user-services-response.dto';
import { ExpertRejectRequestDto } from './dto/expert-reject-request.dto';
import { UserCounstDto } from './dto/list/users-counts-response.dto';
import { GetUsersQueryDto } from './dto/list/users-query.dto';
import { UserItemDto } from './dto/list/users-response.dto';
import { PageQueryDto } from './dto/page-query.dto';

import type { AdminJwtAccessUser } from '../admin-auth/jwt/admin-jwt-access.strategy';
import type { Request } from 'express';

@ApiTags('admin-user')
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @ApiOperation({ summary: '어드민 유저 리스트 (일반/판매자탭)' })
  @ApiPaginatedResponse(HttpStatus.OK, UserItemDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get()
  getUsers(@Query() query: GetUsersQueryDto): Promise<Paginated<UserItemDto>> {
    return this.adminUserService.getUsers(query);
  }

  @ApiOperation({ summary: '어드민 유저 리스트 탭 카운트(전체, 필터무관)' })
  @ApiSuccessResponse(HttpStatus.OK, UserCounstDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get('counts')
  getCounts(): Promise<UserCounstDto> {
    return this.adminUserService.getCounts();
  }

  @ApiOperation({ summary: '어드민 유저 상세 (일반/판매자 통합)' })
  @ApiSuccessResponse(HttpStatus.OK, UserDetailResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':id')
  getUserDetail(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
  ): Promise<UserDetailResponseDto> {
    return this.adminUserService.getUserDetail(id);
  }

  @ApiOperation({ summary: '[어드민] 회원 상세 - 구매내역 (일반회원) CLIENT' })
  @ApiPaginatedResponse(HttpStatus.OK, UserOrderItemDto)
  @ApiErrorResponse(USER_ERRORS.ROLE_MISMATCH)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':id/orders')
  getUserOrders(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
    @Query() query: PageQueryDto,
  ): Promise<Paginated<UserOrderItemDto>> {
    return this.adminUserService.getUserOrders(id, query);
  }

  @ApiOperation({
    summary: '[어드민] 회원 상세 - 등록 서비스 목록 (판매자) EXPERT',
  })
  @ApiPaginatedResponse(HttpStatus.OK, UserServiceItemDto)
  @ApiErrorResponse(USER_ERRORS.ROLE_MISMATCH)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':id/services')
  getUserServices(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
    @Query() query: PageQueryDto,
  ): Promise<Paginated<UserServiceItemDto>> {
    return this.adminUserService.getUserServices(id, query);
  }

  @ApiOperation({ summary: '[어드민] 회원 상세 - 신고 받은 내역' })
  @ApiPaginatedResponse(HttpStatus.OK, UserReportReceivedItemDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':id/reports/received')
  getUserReportsReceived(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
    @Query() query: PageQueryDto,
  ): Promise<Paginated<UserReportReceivedItemDto>> {
    return this.adminUserService.getUserReportsReceived(id, query);
  }

  @ApiOperation({ summary: '[어드민] 회원 상세 - 신고한 내역' })
  @ApiPaginatedResponse(HttpStatus.OK, UserReportSentItemDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':id/reports/sent')
  getUserReportsSent(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
    @Query() query: PageQueryDto,
  ): Promise<Paginated<UserReportSentItemDto>> {
    return this.adminUserService.getUserReportsSent(id, query);
  }

  @ApiOperation({ summary: '[어드민] 회원 상세 - 작성 게시글' })
  @ApiPaginatedResponse(HttpStatus.OK, UserPostItemDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':id/posts')
  getUserPosts(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
    @Query() query: PageQueryDto,
  ): Promise<Paginated<UserPostItemDto>> {
    return this.adminUserService.getUserPosts(id, query);
  }

  @ApiOperation({ summary: '[어드민] 회원 상세 - 작성 댓글' })
  @ApiPaginatedResponse(HttpStatus.OK, UserCommentItemDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':id/comments')
  getUserComments(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
    @Query() query: PageQueryDto,
  ): Promise<Paginated<UserCommentItemDto>> {
    return this.adminUserService.getUserComments(id, query);
  }

  @ApiOperation({ summary: '[어드민] 회원 블랙리스트 등록' })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(USER_ERRORS.ALREADY_BLOCKED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':id/blacklist')
  blockUser(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
    @Req() req: Request,
  ): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    return this.adminUserService.blockUser(id, adminId);
  }

  @ApiOperation({ summary: '[어드민] 회원 블랙리스트 해제' })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(USER_ERRORS.NOT_BLOCKED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id/blacklist')
  unblockUser(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
    @Req() req: Request,
  ): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    return this.adminUserService.unblockUser(id, adminId);
  }

  @ApiOperation({ summary: '[어드민] 전문가 신청 승인' })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(USER_ERRORS.ROLE_MISMATCH)
  @ApiErrorResponse(EXPERT_PROFILE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(EXPERT_PROFILE_ERRORS.ALREADY_APPROVED)
  @ApiErrorResponse(EXPERT_PROFILE_ERRORS.NOT_APPLIED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':id/expert/approve')
  approveExpert(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
    @Req() req: Request,
  ): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    return this.adminUserService.approveExpert(id, adminId);
  }

  @ApiOperation({ summary: '[어드민] 전문가 신청 거절' })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(USER_ERRORS.ROLE_MISMATCH)
  @ApiErrorResponse(EXPERT_PROFILE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(EXPERT_PROFILE_ERRORS.ALREADY_APPROVED)
  @ApiErrorResponse(EXPERT_PROFILE_ERRORS.NOT_APPLIED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':id/expert/reject')
  rejectExpert(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(USER_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
    @Body() body: ExpertRejectRequestDto,
    @Req() req: Request,
  ): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    return this.adminUserService.rejectExpert(id, adminId, body.rejectReason);
  }
}
