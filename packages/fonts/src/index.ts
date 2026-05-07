import localFont from 'next/font/local';

export const nanumSquare = localFont({
  src: [
    { path: './NanumSquareOTF_acR.otf', weight: '400', style: 'normal' },
    { path: './NanumSquareOTF_acB.otf', weight: '700', style: 'normal' },
    { path: './NanumSquareOTF_acEB.otf', weight: '800', style: 'normal' },
  ],
  variable: '--font-nanum-square',
  display: 'swap',
});
