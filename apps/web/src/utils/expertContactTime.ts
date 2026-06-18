import { publicApi } from '@repo/fetcher';

import type { ApiSuccess } from '@/types/api';

export interface ContactTimeDisplay {
  start: string;
  end: string;
}

interface ExpertProfileSummaryApi {
  businessName: string | null;
  contactTimeStart: string | null;
  contactTimeEnd: string | null;
}

function formatContactTimePart(value: string): string {
  const [hourText, minuteText = '00'] = value.split(':');
  const hour = Number(hourText);
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour > 12 ? hour - 12 : hour;

  return `${period} ${String(displayHour).padStart(2, '0')}:${minuteText}`;
}

export function buildContactTimeDisplay(
  start: string | null | undefined,
  end: string | null | undefined,
): ContactTimeDisplay {
  return {
    start: formatContactTimePart(start ?? '09:00'),
    end: formatContactTimePart(end ?? '18:00'),
  };
}

export const DEFAULT_CONTACT_TIME_DISPLAY = buildContactTimeDisplay(
  '09:00',
  '18:00',
);

export async function fetchExpertContactTime(
  expertUserId: string,
): Promise<ContactTimeDisplay> {
  const summary = await fetchExpertProfileSummary(expertUserId);
  return summary.contactTime;
}

export async function fetchExpertProfileSummary(expertUserId: string): Promise<{
  companyName: string;
  contactTime: ContactTimeDisplay;
}> {
  try {
    const response = await publicApi.get<ApiSuccess<ExpertProfileSummaryApi>>(
      `/users/${expertUserId}`,
    );
    const data = response.data;

    return {
      companyName: data.businessName ?? '전문가',
      contactTime: buildContactTimeDisplay(
        data.contactTimeStart,
        data.contactTimeEnd,
      ),
    };
  } catch {
    return {
      companyName: '전문가',
      contactTime: DEFAULT_CONTACT_TIME_DISPLAY,
    };
  }
}
