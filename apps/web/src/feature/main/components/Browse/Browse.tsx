import * as styles from './Browse.css';
import { BrowseCard } from './BrowseCard';

import { IT_COACHING_LIST_CONFIG } from '@/feature/itCoaching/constants';
import { PROJECT_REQUEST_LIST_CONFIG } from '@/feature/projectRequest/constants';

export default function Browse() {
  return (
    <section className={styles.wrapper}>
      <BrowseCard
        config={IT_COACHING_LIST_CONFIG}
        tone="blue"
        title="IT 코칭 · 멘토링"
        description="현업 시니어와 1:1, 실무 질문부터 커리어까지"
      />
      <BrowseCard
        config={PROJECT_REQUEST_LIST_CONFIG}
        tone="dark"
        title="프로젝트 의뢰"
        description="기획부터 배포까지, 검증된 팀과 협업"
      />
    </section>
  );
}
