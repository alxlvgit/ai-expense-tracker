/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: 10 * 1024 * 1024, // 10mb
    },
  },
};

module.exports = nextConfig;
