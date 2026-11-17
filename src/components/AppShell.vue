<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getDataMode } from '../api/crmApi'

const route = useRoute()
const mode = ref<'mock' | 'bitrix'>('mock')

onMounted(() => {
  mode.value = getDataMode()
})

const links = [
  { to: '/', label: 'CRM сделки' },
  { to: '/installer', label: 'Монтажники' },
  { to: '/coverage', label: 'Карта покрытия' },
]
</script>

<template>
  <div class="min-h-screen">
    <header class="border-b border-line/80 bg-ink/70 backdrop-blur">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-accent">Bitrix24 · Vue Demo</p>
          <h1 class="text-lg font-semibold">Корпоративный CRM-портал</h1>
          <p class="text-xs text-white/45">
            Режим данных:
            <span :class="mode === 'bitrix' ? 'text-accent2' : 'text-warn'">
              {{ mode === 'bitrix' ? 'живой Bitrix24 CRM' : 'mock (локально)' }}
            </span>
          </p>
        </div>
        <nav class="flex flex-wrap gap-2">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-xl px-3 py-2 text-sm transition"
            :class="
              route.path === link.to || (link.to !== '/' && route.path.startsWith(link.to))
                ? 'bg-accent text-ink font-semibold'
                : 'bg-white/5 hover:bg-white/10'
            "
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>
