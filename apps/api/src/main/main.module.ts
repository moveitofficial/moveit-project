import { Module } from '@nestjs/common';

import { MainController } from './main.controller';
import { MainRepository } from './main.repository';
import { MainService } from './main.service';

@Module({
  controllers: [MainController],
  providers: [MainService, MainRepository],
})
export class MainModule {}
