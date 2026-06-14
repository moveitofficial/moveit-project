import clientProfile from '@public/SignUp/client.svg';
import exportProfile from '@public/SignUp/export.svg';
import signupLogo from '@public/SignUp/signUpLogo.svg';
import Image from 'next/image';
import Link from 'next/link';

import * as styles from './RoleSelector.css';

const roleItemData = [
  {
    id: 1,
    img: clientProfile,
    title: '의뢰인으로 이용',
    desc: '내가 원하는 서비스의 전문가를 찾아서 도움을 받고 싶어요',
  },
  {
    id: 2,
    img: exportProfile,
    title: '전문가로 활동',
    desc: '내가 잘하는 분야의 전문가로 활동하고 수익을 창출하고 싶어요',
  },
];

export default function RoleSelector() {
  return (
    <section className={styles.Container}>
      <div className={styles.titleWrapper}>
        <Link href="/login">
          <Image src={signupLogo} alt="logo" />
        </Link>
        <div className={styles.title}>
          무빗에서 어떤 서비스를
          <br /> 어떻게 이용하고 싶으세요?
        </div>
      </div>
      <div className={styles.selectRoleWrapper}>
        {roleItemData.map((data) => (
          <div key={data.id} className={styles.selectRoleInner}>
            <Image src={data.img} alt="profileImg" />
            <div className={styles.textGroup}>
              <div className={styles.titleText}>{data.title}</div>
              <div className={styles.descText}>{data.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
