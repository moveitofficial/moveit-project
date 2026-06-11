import { Injectable } from '@nestjs/common';

import { REPORT_ERRORS, USER_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { UsersService } from '../users/users.service';

import { ReportsRequestDto } from './dto/reports-request.dto';
import { ReportsResponseDto } from './dto/reports-response.dto';
import { ReportsRepository } from './reports.repository';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly usersService: UsersService,
  ) {}

  async createReport(
    reporterId: string,
    dto: ReportsRequestDto,
  ): Promise<ReportsResponseDto> {
    if (reporterId === dto.reportedUserId) {
      throw new AppException(REPORT_ERRORS.SELF_REPORT);
    }

    const reportedUser = await this.usersService.findUserById(
      dto.reportedUserId,
    );

    if (reportedUser === null) {
      throw new AppException(USER_ERRORS.NOT_FOUND);
    }

    if (reportedUser.isDeleted) {
      throw new AppException(USER_ERRORS.DELETED);
    }

    const report = await this.reportsRepository.create(reporterId, dto);

    return {
      id: report.id,
      status: report.status,
    };
  }
}
