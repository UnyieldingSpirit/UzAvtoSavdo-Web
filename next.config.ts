// next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    unoptimized: true,
    domains: [
      'i.imgur.com',
      'uzavtosavdo.uz',
      'telegra.ph',
      'static-maps.yandex.ru',
      'chevrolet.uz',
    ]
  }
};

export default config;