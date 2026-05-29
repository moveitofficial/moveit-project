import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { ChatModule } from './chat/chat.module';
import { ClientProfilesModule } from './client-profiles/client-profiles.module';
import { RolesGuard } from './common/guards/roles.guard';
import { CommunityPostsModule } from './community-posts/community-posts.module';
import { ExpertProfilesModule } from './expert-profiles/expert-profiles.module';
import { HealthModule } from './health/health.module';
import { MailerModule } from './mailer/mailer.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { PrismaModule } from './prisma/prisma.module';
import { S3Module } from './s3/s3.module';
import { ServicesModule } from './services/services.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
    }),
    PrismaModule,
    AuthModule,
    HealthModule,
    ChatModule,
    UsersModule,
    S3Module,
    UploadModule,
    CatalogsModule,
    ClientProfilesModule,
    ServicesModule,
    AdminModule,
    ExpertProfilesModule,
    PortfoliosModule,
    MailerModule,
    CommunityPostsModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule {}
