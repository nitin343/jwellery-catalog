import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.29.154',
    '192.168.29.154:4000',
    '10.149.227.103',
    '10.149.227.103:4000',
    '10.114.94.103',
    '10.114.94.103:4000',
    'localhost:4000',
    '127.0.0.1:4000',
  ],
};

export default nextConfig;
