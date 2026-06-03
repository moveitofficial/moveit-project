import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import { ClientProfilesService } from '../client-profiles/client-profiles.service';
import { ClientProfileRequestDto } from '../client-profiles/dto/client-profile-request.dto';
import {
  ClientProfileResponseDto,
  CreateClientProfileResponseDto,
} from '../client-profiles/dto/client-profile-response.dto';
import {
  CLIENT_PROFILE_ERRORS,
  COMMON_ERRORS,
  EXPERT_PROFILE_ERRORS,
  UPLOAD_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiFileBody } from '../common/decorators/api-file-body.decorator';
import {
  ApiOneOfSuccessResponse,
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../common/decorators/api-success-response.decorator';
import { JwtAuth, RoleAuth } from '../common/decorators/jwt-auth.decorator';
import { ExpertProfileRequestDto } from '../expert-profiles/dto/expert-profile-request.dto';
import {
  ApplyForApprovalResponseDto,
  CreateExpertProfileResponseDto,
  UpdateExpertProfileResponseDto,
} from '../expert-profiles/dto/expert-profile-response.dto';
import { ExpertProfilesService } from '../expert-profiles/expert-profiles.service';
import { MyReviewsQueryDto } from '../services/dto/my-reviews-query.dto';
import { MyReviewListItemResponseDto } from '../services/dto/service-response.dto';

import { MyCommentsQueryDto } from './dto/my-comments-query.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { UpdateExpertProfileDto } from './dto/update-expert-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ClientUserResponseDto,
  ExpertUserResponseDto,
  MyCommentListItemResponseDto,
  UserResponseDto,
} from './dto/user-response.dto';
import { WithdrawDataDto, WithdrawRequestDto } from './dto/withdraw.dto';
import { UsersService } from './users.service';

import type { Request } from 'express';

@ApiTags('users/me')
@Controller('users/me')
export class MeController {
  constructor(
    private readonly usersService: UsersService,
    private readonly clientProfilesService: ClientProfilesService,
    private readonly expertProfilesService: ExpertProfilesService,
  ) {}

  @ApiOperation({ summary: '내 정보 조회하기' })
  @JwtAuth()
  @ApiOneOfSuccessResponse(
    HttpStatus.OK,
    ClientUserResponseDto,
    ExpertUserResponseDto,
  )
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get()
  getMe(@Req() req: Request) {
    const user = req.user as JwtAccessUser;
    return this.usersService.getUserById(user.userId);
  }

  @ApiOperation({ summary: '내 정보 수정하기' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK, UserResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch()
  updateMe(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const user = req.user as JwtAccessUser;
    return this.usersService.updateUser(user.userId, dto);
  }

  @ApiOperation({ summary: '프로필 이미지 변경' })
  @JwtAuth()
  @ApiConsumes('multipart/form-data')
  @ApiFileBody('profileImage')
  @ApiSuccessResponse(HttpStatus.OK, UserResponseDto)
  @ApiErrorResponse(
    UPLOAD_ERRORS.FILE_NOT_ATTACHED,
    UPLOAD_ERRORS.INVALID_FILE_TYPE,
    UPLOAD_ERRORS.IMAGE_METADATA_UNREADABLE,
    UPLOAD_ERRORS.PROFILE_IMAGE_TOO_LARGE,
  )
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch('profile-image')
  @UseInterceptors(FileInterceptor('profileImage'))
  updateProfileImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    const user = req.user as JwtAccessUser;
    return this.usersService.updateProfileImage(user.userId, file);
  }

  @ApiOperation({ summary: '비밀번호 변경하기' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    USER_ERRORS.INVALID_PASSWORD,
    USER_ERRORS.PASSWORD_MISMATCH,
  )
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch('password')
  updatePassword(@Req() req: Request, @Body() dto: UpdatePasswordDto) {
    const user = req.user as JwtAccessUser;
    return this.usersService.updatePassword(user.userId, dto);
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK, WithdrawDataDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Delete()
  withdrawMyAccount(@Req() req: Request, @Body() dto: WithdrawRequestDto) {
    const user = req.user as JwtAccessUser;
    return this.usersService.withdrawUser(user.userId, dto.deletionReason);
  }

  @ApiOperation({ summary: '의뢰인 프로필 등록' })
  @RoleAuth(Role.CLIENT)
  @ApiSuccessResponse(HttpStatus.CREATED, CreateClientProfileResponseDto)
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    CLIENT_PROFILE_ERRORS.MIXED_SERVICE_GROUP,
  )
  @ApiErrorResponse(CLIENT_PROFILE_ERRORS.ALREADY_EXISTS)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Post('client-profiles')
  createClientProfile(
    @Req() req: Request,
    @Body() dto: ClientProfileRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.clientProfilesService.createClientProfile(user.userId, dto);
  }

  @ApiOperation({ summary: '전문가 프로필 등록' })
  @RoleAuth(Role.EXPERT)
  @ApiSuccessResponse(HttpStatus.CREATED, CreateExpertProfileResponseDto)
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    EXPERT_PROFILE_ERRORS.MIXED_SERVICE_GROUP,
  )
  @ApiErrorResponse(EXPERT_PROFILE_ERRORS.ALREADY_EXISTS)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Post('expert-profiles')
  createExpertProfile(
    @Req() req: Request,
    @Body() dto: ExpertProfileRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.expertProfilesService.createExpertProfile(user.userId, dto);
  }

  @ApiOperation({ summary: '전문가 승인 신청' })
  @RoleAuth(Role.EXPERT)
  @ApiSuccessResponse(HttpStatus.OK, ApplyForApprovalResponseDto)
  @ApiErrorResponse(EXPERT_PROFILE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(
    EXPERT_PROFILE_ERRORS.ALREADY_APPLIED,
    EXPERT_PROFILE_ERRORS.ALREADY_APPROVED,
    EXPERT_PROFILE_ERRORS.INCOMPLETE_PROFILE,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Post('expert-profiles/apply')
  applyForApproval(@Req() req: Request) {
    const user = req.user as JwtAccessUser;
    return this.expertProfilesService.applyForApproval(user.userId);
  }

  @ApiOperation({ summary: '의뢰인 프로필 수정하기' })
  @RoleAuth(Role.CLIENT)
  @ApiSuccessResponse(HttpStatus.OK, ClientProfileResponseDto)
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    CLIENT_PROFILE_ERRORS.MIXED_SERVICE_GROUP,
  )
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch('client-profile')
  updateClientProfile(
    @Req() req: Request,
    @Body() dto: UpdateClientProfileDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.clientProfilesService.updateClientProfile(user.userId, dto);
  }

  @ApiOperation({ summary: '전문가 프로필 수정하기' })
  @RoleAuth(Role.EXPERT)
  @ApiSuccessResponse(HttpStatus.OK, UpdateExpertProfileResponseDto)
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    EXPERT_PROFILE_ERRORS.MIXED_SERVICE_GROUP,
  )
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch('expert-profile')
  updateExpertProfile(
    @Req() req: Request,
    @Body() dto: UpdateExpertProfileDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.expertProfilesService.updateExpertProfile(user.userId, dto);
  }

  @ApiOperation({ summary: '내 리뷰 목록 조회' })
  @RoleAuth(Role.CLIENT)
  @ApiPaginatedResponse(HttpStatus.OK, MyReviewListItemResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('reviews')
  getMyReviews(@Req() req: Request, @Query() query: MyReviewsQueryDto) {
    const user = req.user as JwtAccessUser;
    return this.usersService.getAllReviewsByUserId(user.userId, query);
  }

  @ApiOperation({ summary: '내 댓글 목록 조회' })
  @JwtAuth()
  @ApiPaginatedResponse(HttpStatus.OK, MyCommentListItemResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('comments')
  getMyComments(@Req() req: Request, @Query() query: MyCommentsQueryDto) {
    const user = req.user as JwtAccessUser;
    return this.usersService.getAllCommentsByUserId(user.userId, query);
  }
}
