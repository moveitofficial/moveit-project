import * as styles from './layout.css';

export default function UserDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.canvas}>{children}</div>;
}
