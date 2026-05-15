import * as styles from './Browse.css';
import { BrowseCard } from './BrowseCard';

const itCategories = ['웹 개발', '앱 제작', 'AI', '게임 개발', '데이터 분석'];
const pjCategories = [
  '웹 제작',
  '앱 제작',
  'AI개발',
  '게임 개발',
  '데이터 분석',
];
export default function Browse() {
  return (
    <section className={styles.wrapper}>
      <BrowseCard
        categoriesText={itCategories}
        tone="blue"
        title="IT 코칭 · 멘토링"
        description="현업 시니어와 1:1, 실무 질문부터 커리어까지"
      />
      <BrowseCard
        categoriesText={pjCategories}
        tone="dark"
        title="프로젝트 의뢰"
        description="기획부터 배포까지, 검증된 팀과 협업"
      />
    </section>
  );
}
