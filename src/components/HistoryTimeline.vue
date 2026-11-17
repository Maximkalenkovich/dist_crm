<script setup lang="ts">
import type { ContactEvent } from '../api/types'

defineProps<{ items: ContactEvent[] }>()

function formatDate(value: string) {
  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <ul class="space-y-3">
    <li
      v-for="item in items"
      :key="item.id"
      class="rounded-xl border border-line/70 bg-ink/40 px-3 py-2"
    >
      <div class="mb-1 flex items-center justify-between gap-2 text-xs text-white/50">
        <span>{{ formatDate(item.at) }}</span>
        <span class="uppercase tracking-wide">{{ item.channel }}</span>
      </div>
      <p class="text-sm text-white/90">{{ item.text }}</p>
    </li>
  </ul>
</template>
