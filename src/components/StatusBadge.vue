<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ status: string }>()

const label = computed(() => {
  const map: Record<string, string> = {
    new: 'Новая',
    check_address: 'Проверка адреса',
    in_progress: 'В работе',
    install: 'Монтаж',
    done: 'Закрыта',
    rejected: 'Отказ',
    assigned: 'Назначена',
    on_site: 'На объекте',
    photo: 'Фотоотчёт',
  }
  return map[props.status] ?? props.status
})

const tone = computed(() => {
  if (['done', 'online'].includes(props.status)) return 'bg-accent2/20 text-accent2'
  if (['install', 'on_site', 'photo', 'in_progress'].includes(props.status))
    return 'bg-warn/20 text-warn'
  if (['rejected', 'offline'].includes(props.status)) return 'bg-danger/20 text-danger'
  return 'bg-accent/15 text-accent'
})
</script>

<template>
  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="tone">
    {{ label }}
  </span>
</template>
