/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: "standalone",
  async headers() {
    return [
      {
        source: "/api/payment/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://gameforsmart.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type",
          },
        ],
      },
    ];
  },
}

export default nextConfig
