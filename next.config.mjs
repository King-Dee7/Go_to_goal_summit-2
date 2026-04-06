/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint warnings/errors won't block the Vercel build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors won't block the Vercel build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

