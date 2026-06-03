import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AdminCsChatController } from './admin-cs-chat.controller';
import { CsChatController } from './cs-chat.controller';
import { CsChatGateway } from './cs-chat.gateway';
import { CsChatRepository } from './cs-chat.repository';
import { CsChatService } from './cs-chat.service';

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
  providers: [CsChatGateway, CsChatService, CsChatRepository],
  controllers: [CsChatController, AdminCsChatController],
})
export class CsChatModule {}
