import { Module } from '@nestjs/common';

import { AdminCategoryFeaturedController } from './admin-category-featured.controller';
import { AdminCategoryFeaturedRepository } from './admin-category-featured.repository';
import { AdminCategoryFeaturedService } from './admin-category-featured.service';

@Module({
  controllers: [AdminCategoryFeaturedController],
  providers: [AdminCategoryFeaturedService, AdminCategoryFeaturedRepository],
})
export class AdminCategoryFeaturedModule {}
