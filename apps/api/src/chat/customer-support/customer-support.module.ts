import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { CustomerSupportGateway } from './customer-support.gateway';
import { CustomerSupportRepository } from './customer-support.repository';
import { CustomerSupportService } from './customer-support.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [
    CustomerSupportGateway,
    CustomerSupportService,
    CustomerSupportRepository,
  ],
})
export class CustomerSupportModule {}
