<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatusBadge from '../components/StatusBadge.vue'
import { useCrmStore } from '../stores/crm'

const store = useCrmStore()
const router = useRouter()

onMounted(() => {
  void store.loadDeals()
})
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-2xl font-semibold">Сделки CRM</h2>
        <p class="text-sm text-white/55">
          Демо виджетов для карточек клиентов и сделок (как в Bitrix24).
        </p>
      </div>
      <button class="btn-ghost" :disabled="store.loading" @click="store.loadDeals()">
        Обновить
      </button>
    </div>

    <div v-if="store.loading" class="card p-6 text-sm text-white/60">Загрузка...</div>

    <div v-else class="grid gap-3">
      <button
        v-for="deal in store.deals"
        :key="deal.id"
        class="card p-4 text-left transition hover:border-accent/50"
        @click="router.push(`/deals/${deal.id}`)"
      >
        <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p class="text-xs text-white/45">{{ deal.id }}</p>
            <h3 class="font-semibold">{{ deal.title }}</h3>
          </div>
          <StatusBadge :status="deal.status" />
        </div>
        <div class="grid gap-1 text-sm text-white/70 sm:grid-cols-3">
          <p>{{ deal.clientName }}</p>
          <p>{{ deal.address }}</p>
          <p>{{ deal.tariff }} · баланс {{ deal.balance }} BYN</p>
        </div>
      </button>
    </div>
  </section>
</template>
