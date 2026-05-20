import * as styles from './RectLabel.css';

export type RectLabelColor = 'blue50' | 'yellow' | 'blue400' | 'blue100' | 'red';

interface LabelProps {
  text: string;
  color: RectLabelColor;
}

export default function RectLabel({ text, color }: LabelProps) {
  return <div className={styles.rectLabelContainer({ color })}>{text}</div>;
}
