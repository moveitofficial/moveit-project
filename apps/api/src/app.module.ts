import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { ChatsModule } from './chats/chats.module';
import { ClientProfilesModule } from './client-profiles/client-profiles.module';
import { RolesGuard } from './common/guards/roles.guard';
import { CommunityPostsModule } from './community-posts/community-posts.module';
import { ExpertProfilesModule } from './expert-profiles/expert-profiles.module';
import { FaqsModule } from './faqs/faqs.module';
import { HealthModule } from './health/health.module';
import { MailerModule } from './mailer/mailer.module';
import { MainModule } from './main/main.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrdersModule } from './orders/orders.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportsModule } from './reports/reports.module';
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
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    HealthModule,
    ChatsModule,
    UsersModule,
    S3Module,
    UploadModule,
    CatalogsModule,
    ClientProfilesModule,
    ServicesModule,
    OrdersModule,
    AdminModule,
    ExpertProfilesModule,
    PortfoliosModule,
    MailerModule,
    CommunityPostsModule,
    NotificationsModule,
    FaqsModule,
    MainModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule {}
