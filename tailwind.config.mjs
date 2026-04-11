/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}", // مهم جداً لأنك تملك نصوصاً في مجلد data
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        indigo: {
          primary: "#6366f1",
        },
      },
      // هنا يمكنك إضافة أي تخصيصات أخرى لـ Animations إذا كنت تستخدمها
    },
  },
  plugins: [],
};