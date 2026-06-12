import * as sectionStyles from '../ServiceDetailView/ServiceDetailView.css';

import ServiceFaqList from './ServiceFaqList';

import type { ServiceFaq } from '@/mocks/types';

interface Props {
  faqs: ServiceFaq[];
}

export default function ServiceFaqSection({ faqs }: Props) {
  return (
    <section id="faq" className={sectionStyles.section}>
      <h2 className={sectionStyles.sectionTitle}>자주 묻는 질문</h2>
      <ServiceFaqList faqs={faqs} />
    </section>
  );
}
