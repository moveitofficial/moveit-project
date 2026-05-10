import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getAllUser() {
    return 'all user';
  }
}
