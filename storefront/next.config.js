const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    staticGenerationRetryCount: 3,
    staticGenerationMaxConcurrency: 1,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "fashion-starter-demo.s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
}

module.exports = nextConfig
