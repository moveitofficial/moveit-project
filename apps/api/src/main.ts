import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import basicAuth from 'express-basic-auth';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // Request 유효성 검사
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 전역 예외 필터
  app.useGlobalFilters(new HttpExceptionFilter());

  // 전역 인터셉터
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('moveit API')
    .setDescription('moveit API 문서')
    .setVersion('1.0')
    .build();
  app.use(
    '/docs',
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER ?? 'admin']:
          process.env.SWAGGER_PASSWORD ??
          (() => {
            throw new Error('SWAGGER_PASSWORD is not set');
          })(),
      },
    }),
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // CORS
  app.enableCors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(
      (url): url is string => url !== undefined,
    ),
    credentials: true,
  });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
