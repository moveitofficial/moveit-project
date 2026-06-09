import { Module } from '@nestjs/common';

import { FavoritesController } from './favorites.controller';
import { FavoritesRepository } from './favorites.repository';
import { FavoritesService } from './favorites.service';
import { ServicesModule } from '../services/services.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ServicesModule, UsersModule]
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoritesRepository],
})
export class FavoritesModule {}
