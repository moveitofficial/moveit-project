import * as styles from './UploadGuide.css';

interface Props {
  spec: string;
}

export default function UploadGuide({ spec }: Props) {
  return (
    <div className={styles.guide}>
      <p className={styles.text}>
        부적절하거나 서비스 정책에 맞지 않는 이미지가 포함된 경우, 해당
        포트폴리오는 별도의 안내 없이 삭제될 수 있습니다.
      </p>
      <p className={styles.text}>{spec}</p>
    </div>
  );
}
