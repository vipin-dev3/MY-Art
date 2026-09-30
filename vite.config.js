import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base path configuration:
// - When deployed to GitHub Pages via GitHub Actions: '/MY-Art/'
// - When deployed to Vercel, Netlify, or locally: './' (relative for portable assets)
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  base: process.env.GITHUB_PAGES ? '/MY-Art/' : './',
})
