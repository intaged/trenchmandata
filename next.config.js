/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'data.solanatracker.io',
      'raw.githubusercontent.com',
      'assets.coingecko.com',
      'solana.com',
      'arweave.net',
      'www.arweave.net',
      'cdn.jsdelivr.net',
      'ipfs.io',
      'metadata.solanatracker.io',
      'static.solanatracker.io',
      'cdn.solanatracker.io',
    ],
    unoptimized: true,
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack: (config, { isServer, dev }) => {
    // WebSocket configuration
    config.infrastructureLogging = {
      level: 'error',
    };
    
    // Optimize builds
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }

    // Development-specific optimizations
    if (dev) {
      config.watchOptions = {
        poll: false,
        aggregateTimeout: 300,
        followSymlinks: true,
      };
    }

    return config;
  },
  // Performance optimizations
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig; 