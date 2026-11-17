import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// На GH Actions — путь репозитория для GitHub Pages; локально — корень
const base = process.env.GITHUB_ACTIONS ? '/dist_crm/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [vue()],
})
