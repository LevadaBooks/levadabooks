import bundleAnalizer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalizer({
    enabled: process.env.ENABLE_BUNDLE_ANALYZE === 'true'
});

export { withBundleAnalyzer };
