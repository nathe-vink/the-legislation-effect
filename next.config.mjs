/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/laws",
  // FRED API key is server-side only — never exposed to the client
  env: {
    FRED_API_KEY: process.env.FRED_API_KEY,
  },
};

export default nextConfig;
