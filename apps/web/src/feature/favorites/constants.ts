export const FAVORITES_TABS = [
  { id: 'service', label: '서비스' },
  { id: 'expert', label: '전문가' },
] as const;

export type FavoritesTabId = (typeof FAVORITES_TABS)[number]['id'];
