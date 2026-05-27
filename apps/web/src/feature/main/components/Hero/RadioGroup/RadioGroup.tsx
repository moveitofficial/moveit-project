import * as styles from './RadioGroup.css';

const radioOptions = ['IT코칭', '프로젝트의뢰'];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function RadioGroup({ value, onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      {radioOptions.map((option) => (
        <label key={option} className={styles.label}>
          <input
            className={styles.radio}
            type="radio"
            name="heroTab"
            value={option}
            checked={value === option}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
          <span className={styles.text}>{option}</span>
        </label>
      ))}
    </div>
  );
}
