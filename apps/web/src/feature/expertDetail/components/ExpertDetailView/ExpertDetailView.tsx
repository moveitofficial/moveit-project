import ExpertDetailHero from '../ExpertDetailHero/ExpertDetailHero';
import ExpertDetailSections from '../ExpertDetailSections/ExpertDetailSections';

import * as styles from './ExpertDetailView.css';

import type { ExpertDetailPageData, ExpertDetailViewerRole } from '../../types';

interface Props {
  data: ExpertDetailPageData;
  viewer: ExpertDetailViewerRole;
}

export default function ExpertDetailView({ data, viewer }: Props) {
  return (
    <div className={styles.page}>
      <div className={styles.heroBand}>
        <div className={styles.heroInner}>
          <ExpertDetailHero data={data} viewer={viewer} />
        </div>
      </div>
      <ExpertDetailSections data={data} viewer={viewer} />
    </div>
  );
}
