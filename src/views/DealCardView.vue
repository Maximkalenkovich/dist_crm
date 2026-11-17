<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HistoryTimeline from '../components/HistoryTimeline.vue'
import StatusBadge from '../components/StatusBadge.vue'
import type { DealStatus } from '../api/types'
import { useCrmStore } from '../stores/crm'

const route = useRoute()
const router = useRouter()
const store = useCrmStore()
const syncing = ref(false)

const statuses: DealStatus[] = [
  'new',
  'check_address',
  'in_progress',
  'install',
  'done',
  'rejected',
]

const deal = computed(() => store.currentDeal)

onMounted(() => {
  void store.loadDeal(String(route.params.id))
})

async function onStatus(status: DealStatus) {
  if (!deal.value) return
  await store.setDealStatus(deal.value.id, status)
}

async function onCheck() {
  if (!deal.value) return
  await store.runAddressCheck(deal.value.address)
}

async function onSync() {
  if (!deal.value) return
  syncing.value = true
  try {
    await store.runBillingSync(deal.value.id)
  } finally {
    syncing.value = false
  }
}
</script>

<template>
  <section class="space-y-4">
    <button class="btn-ghost" @click="router.push('/')">← К списку</button>

    <div v-if="store.loading" class="card p-6 text-sm text-white/60">Загрузка карточки...</div>

    <template v-else-if="deal">
      <div class="card p-5">
        <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="text-xs text-white/45">{{ deal.id }}</p>
            <h2 class="text-2xl font-semibold">{{ deal.title }}</h2>
            <p class="mt-1 text-sm text-white/60">
              {{ deal.clientName }} · {{ deal.phone }}
            </p>
          </div>
          <StatusBadge :status="deal.status" />
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          <div class="rounded-xl border border-line bg-ink/40 p-3">
            <p class="text-xs text-white/45">Адрес</p>
            <p class="text-sm">{{ deal.address }}</p>
          </div>
          <div class="rounded-xl border border-line bg-ink/40 p-3">
            <p class="text-xs text-white/45">Тариф / биллинг</p>
            <p class="text-sm">{{ deal.tariff }}</p>
            <p class="text-sm text-accent2">Баланс: {{ deal.balance }} BYN</p>
          </div>
          <div class="rounded-xl border border-line bg-ink/40 p-3">
            <p class="text-xs text-white/45">Статус подключения</p>
            <StatusBadge :status="deal.connectionStatus" />
          </div>
        </div>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <div class="card space-y-3 p-5">
          <h3 class="font-semibold">Действия менеджера</h3>
          <label class="block text-sm text-white/60">
            Сменить статус заявки
            <select
              class="input mt-1"
              :value="deal.status"
              @change="onStatus(($event.target as HTMLSelectElement).value as DealStatus)"
            >
              <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>

          <div class="flex flex-wrap gap-2">
            <button class="btn-primary" @click="onCheck">Проверить адрес</button>
            <button class="btn-ghost" :disabled="syncing" @click="onSync">
              {{ syncing ? 'Синхронизация...' : 'Синк с биллингом' }}
            </button>
          </div>

          <div
            v-if="store.addressResult"
            class="rounded-xl border border-line bg-ink/50 p-3 text-sm"
          >
            <p class="font-medium">
              {{ store.addressResult.available ? 'Подключение доступно' : 'Нет покрытия' }}
            </p>
            <p class="text-white/65">
              {{ store.addressResult.technology }}
              <template v-if="store.addressResult.zoneName">
                · зона {{ store.addressResult.zoneName }}
              </template>
              <template v-if="store.addressResult.etaDays">
                · ETA {{ store.addressResult.etaDays }} дн.
              </template>
            </p>
          </div>
        </div>

        <div class="card p-5">
          <h3 class="mb-3 font-semibold">История обращений</h3>
          <HistoryTimeline :items="deal.history" />
        </div>
      </div>
    </template>
  </section>
</template>
