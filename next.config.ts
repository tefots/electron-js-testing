import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable static export
  // output: 'export', ← REMOVED
  
  // Enable proper Electron support
  basePath: '',
  assetPrefix: '',
  trailingSlash: false,
  
  // Image handling
  images: {
    unoptimized: true, // Disable Image Optimization API
  },

  // Webpack configuration for Electron
  webpack: (config, { isServer, dev }) => {
    // Electron-specific fixes
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'fs': false,
        'path': false,
        'os': false,
      };
    }

    // Enable source maps in development
    if (dev) {
      config.devtool = 'cheap-module-source-map';
    }

    return config;
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_IS_ELECTRON: 'true',
  },
  
  // Disable strict type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;