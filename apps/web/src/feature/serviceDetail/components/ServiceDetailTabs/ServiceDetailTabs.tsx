'use client';

import { useEffect, useState } from 'react';

import { SERVICE_DETAIL_TABS, SERVICE_DETAIL_TAB_STICKY_TOP } from '../../constants';

import * as styles from './ServiceDetailTabs.css';

import type { ServiceDetailTabId } from '../../types';

const TAB_BAR_HEIGHT = 58;

export default function ServiceDetailTabs() {
  const [activeId, setActiveId] = useState<ServiceDetailTabId>('portfolio');

  useEffect(() => {
    const sectionIds = SERVICE_DETAIL_TABS.map((tab) => tab.id);

    const updateActiveTab = () => {
      const scrollOffset = SERVICE_DETAIL_TAB_STICKY_TOP + TAB_BAR_HEIGHT;
      let current: ServiceDetailTabId = 'portfolio';

      for (const id of sectionIds) {
        const element = document.querySelector(`#${id}`);
        if (element !== null && element.getBoundingClientRect().top <= scrollOffset) {
          current = id;
        }
      }

      setActiveId(current);
    };

    updateActiveTab();
    window.addEventListener('scroll', updateActiveTab, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateActiveTab);
    };
  }, []);

  return (
    <nav aria-label="서비스 상세 섹션" className={styles.tabNav}>
      <ul className={styles.tabList}>
        {SERVICE_DETAIL_TABS.map((tab) => (
          <li key={tab.id}>
            <a
              href={`#${tab.id}`}
              className={styles.tabLink({ active: activeId === tab.id })}
              aria-current={activeId === tab.id ? 'location' : undefined}
              onClick={() => {
                setActiveId(tab.id);
              }}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
