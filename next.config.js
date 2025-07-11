/** @type {import('next').NextConfig} */
const path = require("path");

// Environment-based API endpoint configuration
const getApiEndpoint = () => {
  if (process.env.NEXT_PUBLIC_AGORA_ENV === "dev") {
    return "https://near-api-158107670134.us-west1.run.app/api";
  }
  // Default to production
  return "https://near-api-237405837378.us-west1.run.app/api";
};

const nextConfig = {
  env: {
    NEXT_PUBLIC_NEAR_API_ENDPOINT: getApiEndpoint(),
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  async redirects() {
    return [];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn4.iconfinder.com",
      },
      {
        protocol: "https",
        hostname: "cdn3.iconfinder.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
    ],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  experimental: {
    instrumentationHook: true,
    // Necessary to prevent github.com/open-telemetry/opentelemetry-js/issues/4297
    serverComponentsExternalPackages: ["@opentelemetry/sdk-node"],
  },
  eslint: {
    // eslint was recently added so there are a lot of lint errors - adding this to prevent build failures for now
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
