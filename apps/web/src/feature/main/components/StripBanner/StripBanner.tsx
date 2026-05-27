import { type Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import * as styles from './StripBanner.css';

interface StripBannerProps {
  imageUrl: string;
  actionUrl: Route;
}

export default function StripBanner({ imageUrl, actionUrl }: StripBannerProps) {
  return (
    <section className={styles.wrapper}>
      <Link href={actionUrl}>
        <Image
          src={imageUrl}
          alt="배너이미지"
          width={1176}
          height={164}
          className={styles.imageWrapper}
        />
      </Link>
    </section>
  );
}
