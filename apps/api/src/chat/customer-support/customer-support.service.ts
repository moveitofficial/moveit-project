import { Injectable } from '@nestjs/common';

import { CustomerSupportRepository } from './customer-support.repository';

@Injectable()
export class CustomerSupportService {
  constructor(private readonly repo: CustomerSupportRepository) {}
}
