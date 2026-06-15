import roundArrow from '@public/main/roundArrow.svg';
import { RoundChip } from '@repo/ui/RoundChip';
import Image from 'next/image';
import Link from 'next/link';

import * as styles from './BrowseCard.css';

import type { ServiceListConfig } from '@/feature/serviceList/types';

import {
  SERVICE_LIST_DEFAULT_PARAMS,
  buildServiceListHref,
} from '@/feature/serviceList/utils';

interface Props {
  config: ServiceListConfig;
  tone: 'blue' | 'dark';
  description: string;
  title: string;
}

export default function BrowseCard({ config, tone, description, title }: Props) {
  const chips = config.categoryOptions.filter((option) => option.id !== 'ALL');

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
          {chips.map((option) => (
            <Link
              key={option.id}
              href={buildServiceListHref(config, SERVICE_LIST_DEFAULT_PARAMS, {
                category: option.id,
              })}
              className={styles.chipLink}
            >
              <RoundChip
                text={option.label}
                size="web"
                color="labelWhite"
                opacity="half"
              />
            </Link>
          ))}
        </div>
        <Link href={config.basePath} aria-label={`${title} 전체 보기`}>
          <Image src={roundArrow} alt="" />
        </Link>
      </div>
    </div>
  );
}
