import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // The book lives inside the dubelteam.com GitHub Pages site, at /broken-collective/
  basePath: '/broken-collective',
}

export default nextConfig
