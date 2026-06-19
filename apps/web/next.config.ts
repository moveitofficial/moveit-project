import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

import type { NextConfig } from 'next';

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  typedRoutes: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      {
        protocol: 'https',
        hostname: 'moveit-uploads.s3.ap-northeast-2.amazonaws.com',
      },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'phinf.pstatic.net' },
      { protocol: 'https', hostname: 'k.kakaocdn.net' },
      { protocol: 'http', hostname: 'k.kakaocdn.net' },
      { protocol: 'https', hostname: 'img1.kakaocdn.net' },
      { protocol: 'http', hostname: 'img1.kakaocdn.net' },
    ],
  },
};

export default withVanillaExtract(nextConfig);
