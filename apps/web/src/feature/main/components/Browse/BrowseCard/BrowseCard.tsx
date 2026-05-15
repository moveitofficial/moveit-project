import roundArrow from '@public/main/roundArrow.svg';
import { RoundChip } from '@repo/ui/RoundChip';
import Image from 'next/image';

import * as styles from './BrowseCard.css';

interface Props {
  categoriesText: string[];
  tone: 'blue' | 'dark';
  description: string;
  title: string;
}

export default function BrowseCard({
  categoriesText,
  tone,
  description,
  title,
}: Props) {
  return (
    <div className={styles.browseCard({ tone })}>
      <div className={styles.textGroup}>
        <div className={styles.caption({ kind: 'label' })}>BROWSE</div>
        <div className={styles.title}>{title}</div>
        <div className={styles.caption({ kind: 'description' })}>
          {description}
        </div>
      </div>
      <div className={styles.tagGroup}>
        <div className={styles.tag}>
          {categoriesText.map((data) => (
            <RoundChip
              text={data}
              size="web"
              color="labelWhite"
              opacity="half"
              key={data}
            />
          ))}
        </div>
        <Image src={roundArrow} alt="roundArrow" />
      </div>
    </div>
  );
}
