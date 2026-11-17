import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initDataLayer } from './api/crmApi'
import { waitForBx24 } from './bitrix/bx24'
import './style.css'

async function bootstrap() {
  const mode = await initDataLayer()
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)

  const bx24 = await waitForBx24(500)
  if (bx24) {
    try {
      const info = bx24.placement.info()
      const dealId = info?.options?.ID
      if (info?.placement?.includes('DEAL') && dealId) {
        await router.isReady()
        await router.replace(`/deals/${dealId}`)
      }
    } catch {
      // opened from left menu
    }
  }

  app.mount('#app')
  console.info(`[crm-demo] data mode: ${mode}`)
}

void bootstrap()
