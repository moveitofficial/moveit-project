import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UploadModule } from '../../upload/upload.module';

import { ConsultationChatController } from './consultation-chat.controller';
import { ConsultationChatGateway } from './consultation-chat.gateway';
import { ConsultationChatRepository } from './consultation-chat.repository';
import { ConsultationChatService } from './consultation-chat.service';

@Module({
  imports: [
    UploadModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [
    ConsultationChatGateway,
    ConsultationChatService,
    ConsultationChatRepository,
  ],
  controllers: [ConsultationChatController],
})
export class ConsultationChatModule {}
