import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ['your-image-domain.com'], // Adjust this as needed
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback.fs = false; // Example: Fix for server-only modules in client bundle
    }
    return config;
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
