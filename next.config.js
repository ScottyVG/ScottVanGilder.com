/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Exclude infrastructure directory from Next.js compilation
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/infrastructure/**', '**/node_modules/**']
    };
    return config;
  }
};

module.exports = nextConfig;
