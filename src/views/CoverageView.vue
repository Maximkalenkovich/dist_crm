<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCrmStore } from '../stores/crm'

const store = useCrmStore()
const address = ref('Минск, ул. Независимости, 12')
const pin = ref<{ x: number; y: number } | null>({ x: 34, y: 36 })

onMounted(() => {
  void store.loadZones()
})

const polygons = computed(() =>
  store.zones.map((z) => ({
    ...z,
    pointsAttr: z.points.map((p) => `${p.x},${p.y}`).join(' '),
    fill:
      z.level === 'ftth'
        ? 'rgba(47,198,246,.35)'
        : z.level === 'gpon'
          ? 'rgba(123,220,181,.32)'
          : 'rgba(245,166,35,.25)',
  })),
)

async function check() {
  await store.runAddressCheck(address.value)
  // Простая визуальная привязка пина для демо
  if (address.value.toLowerCase().includes('независимости')) pin.value = { x: 34, y: 36 }
  else if (address.value.toLowerCase().includes('победителей')) pin.value = { x: 40, y: 30 }
  else if (address.value.toLowerCase().includes('коласа')) pin.value = { x: 72, y: 42 }
  else pin.value = { x: 50, y: 70 }
}
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-2xl font-semibold">Карта покрытия</h2>
      <p class="text-sm text-white/55">
        Демо-адаптер карты (на проде — Yandex Maps API в Vue-компоненте).
      </p>
    </div>

    <div class="card grid gap-4 p-4 lg:grid-cols-[1.2fr_.8fr]">
      <div class="overflow-hidden rounded-xl border border-line bg-ink">
        <svg viewBox="0 0 100 80" class="h-[340px] w-full">
          <defs>
            <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(255,255,255,.06)" stroke-width=".3" />
            </pattern>
          </defs>
          <rect width="100" height="80" fill="url(#grid)" />
          <polygon
            v-for="z in polygons"
            :key="z.id"
            :points="z.pointsAttr"
            :fill="z.fill"
            stroke="rgba(255,255,255,.35)"
            stroke-width=".4"
          />
          <circle
            v-if="pin"
            :cx="pin.x"
            :cy="pin.y"
            r="1.8"
            fill="#ff6b6b"
            stroke="#fff"
            stroke-width=".4"
          />
        </svg>
      </div>

      <div class="space-y-3">
        <label class="block text-sm text-white/60">
          Адрес для проверки
          <input v-model="address" class="input mt-1" placeholder="Город, улица, дом" />
        </label>
        <button class="btn-primary w-full" @click="check">Проверить покрытие</button>

        <div v-if="store.addressResult" class="rounded-xl border border-line bg-ink/50 p-3 text-sm">
          <p class="font-semibold">
            {{ store.addressResult.available ? 'Можно подключать' : 'Пока недоступно' }}
          </p>
          <p class="text-white/65">{{ store.addressResult.technology }}</p>
          <p v-if="store.addressResult.zoneName" class="text-white/65">
            Зона: {{ store.addressResult.zoneName }}
          </p>
          <p v-if="store.addressResult.etaDays" class="text-accent2">
            Срок: ~{{ store.addressResult.etaDays }} дня
          </p>
        </div>

        <ul class="space-y-2 text-sm text-white/70">
          <li v-for="z in store.zones" :key="z.id" class="flex items-center gap-2">
            <span
              class="h-3 w-3 rounded-full"
              :class="{
                'bg-accent': z.level === 'ftth',
                'bg-accent2': z.level === 'gpon',
                'bg-warn': z.level === 'planned',
              }"
            />
            {{ z.name }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
