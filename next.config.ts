import type { NextConfig } from 'next';

// Define the base Next.js configuration
const baseConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'clerk.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'stage-demo-shortening-url.s3.ap-southeast-1.amazonaws.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'staging.bhutanndi.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'demo-client.bhutanndi.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'bhutanndi.com',
        port: '',
        pathname: '/**'
      }
    ],
    unoptimized: false
  },
  transpilePackages: ['geist']
};

let configWithPlugins = baseConfig;

const nextConfig = configWithPlugins;
export default nextConfig;
