import { Module } from '@nestjs/common';

import { ServicesModule } from '../services/services.module';
import { UsersModule } from '../users/users.module';

import { FavoritesController } from './favorites.controller';
import { FavoritesRepository } from './favorites.repository';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [ServicesModule, UsersModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoritesRepository],
})
export class FavoritesModule {}
