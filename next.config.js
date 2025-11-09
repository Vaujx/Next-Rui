/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables (add any you need; accessible via process.env)
  // For Vercel, set these in the dashboard instead of hardcoding.
  env: {
    // EXAMPLE_API_KEY: 'your-key-here', // Uncomment and customize if needed
  },

  // If deploying under a subpath (e.g., yourdomain.com/rui), set this
  // basePath: '/rui',

  // Image optimization config (useful if you add Next.js <Image> components)
  images: {
    domains: ['example.com'], // Replace with domains for any external images
  },

  // Enable React Strict Mode for better development warnings
  reactStrictMode: true,

  // Optional: For larger API payloads if downloads exceed defaults (rare for this app)
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase if needed for larger video streams
    },
  },
};

module.exports = nextConfig;