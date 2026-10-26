// The browser calls /api/* on the Next.js server, which forwards it to Spring Boot.
// BACKEND_URL is read when the app is built (set as a build arg in Docker).
const backend = process.env.BACKEND_URL || 'http://localhost:8080'

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }]
  },
}

module.exports = nextConfig
