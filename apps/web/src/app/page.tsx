import * as styles from './page.css';

import { Browse } from '@/feature/main/components/Browse';
import Hero from '@/feature/main/components/Hero/Hero';

export default function Home() {
  return (
    <main className={styles.container}>
      <Hero />
      <Browse />
    </main>
  );
}
