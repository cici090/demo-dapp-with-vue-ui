import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/',
  // server: {
  //   host: true,
  //   port: 28847,
  // // },
  define: {
    'process.env.VITE_GH_PAGES': JSON.stringify(process.env.VITE_GH_PAGES == '1' ? '1' : ''),
    'process.env.GH_PAGES': JSON.stringify(process.env.VGH_PAGES == '1' ? '1' : ''),
  },
  optimizeDeps: {
    include: ['vue','buffer'],
  },
  plugins: [
    vue()
  ],
  base: process.env.GH_PAGES ? '/demo-dapp-with-vue-ui/' : './',
  // base: '/demo-dapp-with-vue-ui/',
  build: {
    outDir: 'docs'
  },
  server: {
    fs: {
      allow: ['../sdk', './'],
    },
  },
})
