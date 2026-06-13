import { getMainSettings } from '@/features/main-setting/api';
import { MainSettingContent } from '@/features/main-setting/MainSettingContent';

export default async function MainSettingPage() {
  const { data } = await getMainSettings();

  return <MainSettingContent data={data} />;
}
