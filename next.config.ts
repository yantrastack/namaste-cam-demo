import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
<<<<<<< Updated upstream
=======
  // Allow browser preview proxy to connect for development
>>>>>>> Stashed changes
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
