import * as styles from './RectLabel.css';

interface LabelProps {
  text: string;
  color: 'blue50' | 'yellow' | 'blue400' | 'blue100' | 'red';
}

export default function RectLabel({ text, color }: LabelProps) {
  return <div className={styles.rectLabelContainer({ color })}>{text}</div>;
}
