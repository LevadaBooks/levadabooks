import type { NextConfig } from 'next';
import { withBundleAnalyzer } from '@/lib/bundle-analizer';

let nextConfig: NextConfig = {
    htmlLimitedBots: /.*/, // https://claude.ai/share/8d09e55a-0cc0-4ef6-9e83-1553ccad383e , https://github.com/vercel/next.js/issues/79313
    experimental: {
        optimizePackageImports: [],
        turbopackFileSystemCacheForDev: true
    }
};

nextConfig = withBundleAnalyzer(nextConfig);

export default nextConfig;
