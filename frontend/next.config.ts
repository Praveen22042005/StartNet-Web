/**
 * @file Next.js Configuration
 * 
 * This configuration file sets up Next.js for the StartNet open source project.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  productionBrowserSourceMaps: false, // Disable source maps in production for better performance
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove the `x-powered-by` header for security
  reactStrictMode: true, // Enable React's strict mode for better error detection
  
  // Typescript configuration
  typescript: {
    // For open source contributions, consider changing this to false in production
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // ESLint configuration
  eslint: {
    // For open source contributions, consider changing this to false in production
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  
  // Environment variables
  env: {
    // Use environment-specific API URL
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  },
  
  // Image optimization configuration
  images: {
    // Use remotePatterns for Next.js 13+ (more secure than domains)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com', // Replace with your actual storage domain in production
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
    formats: ['image/webp'],
    unoptimized: process.env.NODE_ENV === 'development',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
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
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // Optional Content Security Policy - uncomment and configure for your needs
          /*
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https://*.example.com;
              font-src 'self';
              connect-src 'self' ${process.env.NEXT_PUBLIC_API_BASE_URL || '*'};
              frame-ancestors 'none';
              form-action 'self';
            `.replace(/\s+/g, ' ').trim()
          }
          */
        ],
      },
    ]
  },
  
  // Experimental features
  experimental: {
    // CSS optimization for production builds
    optimizeCss: process.env.NODE_ENV === 'production' ? {
      enabled: true
    } : false,
    
    // Reduce bundle size by optimizing imports from these packages
    optimizePackageImports: [
      'react-icons',
      'date-fns',
      'lodash',
      '@radix-ui/react-icons'
    ],
    
    // Handle SVG imports with SVGR
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack']
      }
    }
  },
  
  // Optional: Add redirects for better UX
  async redirects() {
    return [
      {
        source: '/investor',
        destination: '/investor/home',
        permanent: true,
      },
      {
        source: '/entrepreneur',
        destination: '/entrepreneur/home',
        permanent: true,
      }
    ]
  }
};

module.exports = nextConfig;