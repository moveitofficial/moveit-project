export const BUSINESS_NUMBER_LENGTH = 10;

const buildTimeOptions = () =>
  Array.from({ length: 24 }, (_, h) => {
    const meridiem = h < 12 ? 'AM' : 'PM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return { id: String(h), label: `${meridiem} ${hour12}시` };
  });

export const TIME_OPTIONS = buildTimeOptions();
