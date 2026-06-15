'use client';

import { typography } from '@repo/styles/typography';
import clsx from 'clsx';
import { type Route } from 'next';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import * as styles from './Header.css';

import type { ServiceGroupName } from '@/mocks/types';

import { parseServiceGroupParam } from '@/feature/serviceDetail/utils';
import { mockServiceList } from '@/mocks/services';

function getServiceGroupFromMock(pathname: string): ServiceGroupName | null {
  if (!pathname.startsWith('/services/')) {
    return null;
  }

  const serviceId = pathname.slice('/services/'.length).split('/')[0] ?? '';

  if (serviceId.length === 0) {
    return null;
  }

  const service = mockServiceList.find((item) => item.id === serviceId);

  return service?.categoryRef.group ?? null;
}

function getServiceGroupFromPathname(
  pathname: string,
): ServiceGroupName | null {
  if (
    pathname.startsWith('/it-coaching/') &&
    pathname.length > '/it-coaching/'.length
  ) {
    return 'IT_COACHING';
  }

  if (
    pathname.startsWith('/project-request/') &&
    pathname.length > '/project-request/'.length
  ) {
    return 'PROJECT_REQUEST';
  }

  return null;
}

function getServiceGroupFromLocation(
  pathname: string,
  groupParam: string | null,
): ServiceGroupName | null {
  const fromPathname = getServiceGroupFromPathname(pathname);
  if (fromPathname !== null) {
    return fromPathname;
  }

  const fromQuery = parseServiceGroupParam(groupParam);
  if (fromQuery !== null) {
    return fromQuery;
  }

  return getServiceGroupFromMock(pathname);
}

function isNavItemActive(
  href: Route,
  pathname: string,
  serviceGroup: ServiceGroupName | null,
): boolean {
  if (href === '#') {
    return false;
  }

  if (pathname === href || pathname.startsWith(`${href}/`)) {
    return true;
  }

  if (href === '/project-request' && serviceGroup === 'PROJECT_REQUEST') {
    return true;
  }

  if (href === '/it-coaching' && serviceGroup === 'IT_COACHING') {
    return true;
  }

  return false;
}

const navItems: { label: string; href: Route }[] = [
  { label: 'IT코칭', href: '/it-coaching' },
  { label: '프로젝트의뢰', href: '/project-request' },
  { label: '자유게시판', href: '/community' },
  { label: 'FAQ', href: '#' },
];

export default function HeaderNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const groupParam = searchParams.get('group');
  const [serviceGroup, setServiceGroup] = useState<ServiceGroupName | null>(
    () => getServiceGroupFromMock(pathname),
  );

  useEffect(() => {
    setServiceGroup(getServiceGroupFromLocation(pathname, groupParam));
  }, [pathname, groupParam]);

  return (
    <nav className={styles.navMenu}>
      {navItems.map((item) => {
        const isActive = isNavItemActive(item.href, pathname, serviceGroup);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={clsx(
              typography.f16R,
              styles.navLink,
              isActive && styles.navLinkActive,
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
