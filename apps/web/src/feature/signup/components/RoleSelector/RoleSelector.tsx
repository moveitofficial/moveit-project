'use client';

import clientProfile from '@public/SignUp/client.svg';
import exportProfile from '@public/SignUp/export.svg';
import signupLogo from '@public/SignUp/signUpLogo.svg';
import Image from 'next/image';
import Link from 'next/link';

import { useBlockBack } from '../../useBlockBack';
import { useOAuthSignUp } from '../../useOAuthSignUp';

import * as styles from './RoleSelector.css';

import type { Role } from '@/types/enums';
import type { MouseEvent } from 'react';

interface Props {
  isSocial: boolean;
}

const roleItemData = [
  {
    id: 1,
    role: 'CLIENT',
    img: clientProfile,
    title: '의뢰인으로 이용',
    desc: '내가 원하는 서비스의 전문가를 찾아서 도움을 받고 싶어요',
  },
  {
    id: 2,
    role: 'EXPERT',
    img: exportProfile,
    title: '전문가로 활동',
    desc: '내가 잘하는 분야의 전문가로 활동하고 수익을 창출하고 싶어요',
  },
] as const;

export default function RoleSelector({ isSocial }: Props) {
  // SNS 회원가입은 역할 선택부터 막는다(뒤로가기 시 SNS 로그인으로 빠지는 것 방지)
  useBlockBack(isSocial);
  const { mutate, isPending } = useOAuthSignUp();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, role: Role) => {
    if (!isSocial) return; // 이메일 회원가입이면 Link 작동
    e.preventDefault(); // SNS 회원가입이면 이동 막고 가입 API 호출
    if (isPending) return;
    mutate(role);
  };

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
          <Link
            key={data.id}
            href={`/signup/email?role=${data.role}`}
            onClick={(e) => {
              handleClick(e, data.role);
            }}
            className={styles.selectRoleInner}
          >
            <Image src={data.img} alt="profileImg" />
            <div className={styles.textGroup}>
              <div className={styles.titleText}>{data.title}</div>
              <div className={styles.descText}>{data.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
