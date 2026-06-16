import messEmpt from '@public/cschat/messEmpt.svg';
import Image from 'next/image';


import * as styles from './CsEmpty.css';

export default function CsEmpty({ text }: { text: string }) {
  return (
    <div className={styles.wrapper}>
      <Image src={messEmpt} alt="" width={48} height={48} />
      <p className={styles.text}>{text}</p>
    </div>
  );
}
