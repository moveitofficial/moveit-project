import { createTheme } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  font: {
    family: 'var(--font-nanum-square), sans-serif',
    weight: {
      regular: '400',
      bold: '700',
      extraBold: '800',
    },
  },
  color: {
    white: '#FFFFFF',

    black100: '#6B6B6B',
    black200: '#525252',
    black300: '#373737',
    black400: '#1F1F1F',
    black500: '#040404',

    gray50: '#E0E0E0',
    gray100: '#DEDEDE',
    gray200: '#C4C4C4',
    gray300: '#ABABAB',
    gray400: '#999999',
    gray500: '#808080',
    textGray: '#667388',

    blue50: '#F5FAFF',
    blue100: '#E9F4FF',
    blue200: '#4DA9FF',
    blue300: '#1B92FF',
    blue400: '#242945',

    yellow100: '#FFC149',

    red100: '#FFEEF0',
    red200: '#FF4F64',

    background100: '#FCFCFC',
    background200: '#F7F7F7',
    background300: '#EFEFEF',
    background400: '#F4F7FB',

    line100: '#F2F2F2',
    line200: '#E6E6E6',
    line300: '#192031',

    adminMenuBackground: '#101729',
    adminBackground: '#F7F8FC',
  },
});
