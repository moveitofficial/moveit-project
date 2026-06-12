import * as sectionStyles from '../ServiceDetailView/ServiceDetailView.css';

import * as styles from './ServiceRefundSection.css';

interface Props {
  refundPolicy: string;
}

export default function ServiceRefundSection({ refundPolicy }: Props) {
  return (
    <section id="refund" className={sectionStyles.section}>
      <h2 className={sectionStyles.sectionTitle}>환불규정</h2>
      <div className={styles.box}>
        <p className={styles.text}>{refundPolicy}</p>
      </div>
    </section>
  );
}
