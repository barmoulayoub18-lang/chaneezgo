/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  //output: 'export',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.gstatic.com' }, // إضافة هذا للسماح بأيقونات جوجل
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self' https://res.cloudinary.com https://*.supabase.co;
              
              script-src 'self' 'unsafe-inline' 'unsafe-eval' 
                https://upload-widget.cloudinary.com 
                https://translate.google.com 
                https://*.google.com 
                https://*.googleapis.com 
                https://www.gstatic.com;
              
              style-src 'self' 'unsafe-inline' 
                https://fonts.googleapis.com 
                https://*.googleapis.com 
                https://www.gstatic.com;
              
              img-src 'self' data: blob: 
                https://res.cloudinary.com 
                https://*.supabase.co 
                https://www.gstatic.com 
                https://*.gstatic.com
                https://www.google.com 
                https://*.google.com
                https://translate.google.com 
                https://*.googleapis.com;
              
              connect-src 'self' 
                https://api.cloudinary.com 
                https://*.cloudinary.com
                https://openrouter.ai 
                https://*.openrouter.ai 
                https://*.supabase.co 
                https://*.googleapis.com
                https://*.google.com;
              
              font-src 'self' https://fonts.gstatic.com;
              
              frame-src 'self' 
                https://upload-widget.cloudinary.com 
                https://res.cloudinary.com 
                https://translate.google.com
                https://*.google.com;
              
              media-src 'self' blob: https://res.cloudinary.com;
              
              worker-src 'self' blob:;
            `.replace(/\s{2,}/g, ' ').trim()
          },
        ],
      },
    ];
  },
  // تم إزالة swcMinify لأنه مفعل تلقائياً في الإصدار 15 وإضافته تسبب خطأ البناء في Vercel
  reactStrictMode: false,
};

export default nextConfig;