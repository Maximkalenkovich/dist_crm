<script setup lang="ts">
import { onMounted } from 'vue'
import StatusBadge from '../components/StatusBadge.vue'
import type { TaskStatus } from '../api/types'
import { useCrmStore } from '../stores/crm'

const store = useCrmStore()

onMounted(() => {
  void store.loadTasks()
})

async function nextStatus(id: string, status: TaskStatus) {
  await store.setTaskStatus(id, status)
}

async function addPhoto(id: string) {
  const name = `photo-${Date.now()}.jpg`
  await store.uploadPhoto(id, name)
}
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-2xl font-semibold">Портал монтажника</h2>
      <p class="text-sm text-white/55">
        Мобильно-адаптивный интерфейс: задачи, статусы, фотоотчёты.
      </p>
    </div>

    <div class="grid gap-3 md:grid-cols-2">
      <article
        v-for="task in store.tasks"
        :key="task.id"
        class="card p-4"
      >
        <div class="mb-2 flex items-start justify-between gap-2">
          <div>
            <p class="text-xs text-white/45">{{ task.id }} · {{ task.dealId }}</p>
            <h3 class="font-semibold">{{ task.title }}</h3>
          </div>
          <StatusBadge :status="task.status" />
        </div>

        <p class="text-sm text-white/70">{{ task.address }}</p>
        <p class="mt-1 text-xs text-white/45">
          Исполнитель: {{ task.assignee }} · до
          {{ new Date(task.dueAt).toLocaleString('ru-RU') }}
        </p>

        <div class="mt-3 h-28 overflow-hidden rounded-xl border border-line bg-ink/50">
          <div
            class="flex h-full items-end justify-between bg-[linear-gradient(135deg,#1d4ed855,#0ea5e955)] p-3 text-xs"
          >
            <span>Карта задачи</span>
            <span>{{ task.lat.toFixed(2) }}, {{ task.lng.toFixed(2) }}</span>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <button
            v-if="task.status === 'assigned'"
            class="btn-primary"
            @click="nextStatus(task.id, 'on_site')"
          >
            На объекте
          </button>
          <button
            v-if="task.status === 'on_site' || task.status === 'photo'"
            class="btn-ghost"
            @click="addPhoto(task.id)"
          >
            Добавить фото
          </button>
          <button
            v-if="task.status !== 'done'"
            class="btn-ghost"
            @click="nextStatus(task.id, 'done')"
          >
            Закрыть заявку
          </button>
        </div>

        <p v-if="task.photos.length" class="mt-2 text-xs text-accent2">
          Фото: {{ task.photos.join(', ') }}
        </p>
      </article>
    </div>
  </section>
</template>
