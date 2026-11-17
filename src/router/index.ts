import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'deals',
      component: () => import('../views/DealsView.vue'),
      meta: { title: 'Сделки CRM' },
    },
    {
      path: '/deals/:id',
      name: 'deal-card',
      component: () => import('../views/DealCardView.vue'),
      meta: { title: 'Карточка сделки' },
    },
    {
      path: '/installer',
      name: 'installer',
      component: () => import('../views/InstallerView.vue'),
      meta: { title: 'Портал монтажника' },
    },
    {
      path: '/coverage',
      name: 'coverage',
      component: () => import('../views/CoverageView.vue'),
      meta: { title: 'Карта покрытия' },
    },
  ],
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'Demo'} · Bitrix CRM Demo`
})

export default router
