import type { NextConfig } from 'next';

// Define the base Next.js configuration
const baseConfig: NextConfig = {
  // Server Actions configuration
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb' // Increase limit for file uploads
    }
  },
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
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5003',
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
