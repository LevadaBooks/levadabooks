import { withSentryConfig } from '@sentry/nextjs';
import { withBundleAnalyzer } from '@/lib/bundle-analizer';
import type { NextConfig } from 'next';

let nextConfig: NextConfig = {
    htmlLimitedBots: /.*/, // https://claude.ai/share/8d09e55a-0cc0-4ef6-9e83-1553ccad383e , https://github.com/vercel/next.js/issues/79313
    experimental: {
        optimizePackageImports: []
    }
};

nextConfig = withSentryConfig(nextConfig, {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: 'levadabooks',
    project: 'website',

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true
});

nextConfig = withBundleAnalyzer(nextConfig);

export default nextConfig;
