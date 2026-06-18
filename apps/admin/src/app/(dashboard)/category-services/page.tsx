import { getCategoryFeatured } from '@/features/category-services/api';
import { CategoryServicesContent } from '@/features/category-services/CategoryServicesContent';

export default async function CategoryServicesPage() {
  const { data } = await getCategoryFeatured();

  return <CategoryServicesContent data={data} />;
}
