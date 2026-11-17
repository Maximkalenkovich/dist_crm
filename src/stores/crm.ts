import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AddressCheckResult, Deal, DealStatus, FieldTask, TaskStatus } from '../api/types'
import * as api from '../api/crmApi'
import type { CoverageZone } from '../api/types'

export const useCrmStore = defineStore('crm', () => {
  const deals = ref<Deal[]>([])
  const tasks = ref<FieldTask[]>([])
  const zones = ref<CoverageZone[]>([])
  const currentDeal = ref<Deal | null>(null)
  const addressResult = ref<AddressCheckResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const openTasks = computed(() => tasks.value.filter((t) => t.status !== 'done'))

  async function loadDeals() {
    loading.value = true
    error.value = null
    try {
      deals.value = await api.fetchDeals()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка загрузки'
    } finally {
      loading.value = false
    }
  }

  async function loadDeal(id: string) {
    loading.value = true
    error.value = null
    try {
      currentDeal.value = (await api.fetchDeal(id)) ?? null
      addressResult.value = null
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка загрузки'
    } finally {
      loading.value = false
    }
  }

  async function setDealStatus(id: string, status: DealStatus) {
    currentDeal.value = await api.updateDealStatus(id, status)
    deals.value = await api.fetchDeals()
  }

  async function runAddressCheck(address: string) {
    addressResult.value = await api.checkAddress(address)
  }

  async function runBillingSync(id: string) {
    currentDeal.value = await api.syncBilling(id)
  }

  async function loadTasks() {
    loading.value = true
    try {
      tasks.value = await api.fetchTasks()
    } finally {
      loading.value = false
    }
  }

  async function setTaskStatus(id: string, status: TaskStatus) {
    await api.updateTaskStatus(id, status)
    tasks.value = await api.fetchTasks()
  }

  async function uploadPhoto(id: string, fileName: string) {
    await api.addTaskPhoto(id, fileName)
    tasks.value = await api.fetchTasks()
  }

  async function loadZones() {
    zones.value = await api.fetchCoverageZones()
  }

  return {
    deals,
    tasks,
    zones,
    currentDeal,
    addressResult,
    loading,
    error,
    openTasks,
    loadDeals,
    loadDeal,
    setDealStatus,
    runAddressCheck,
    runBillingSync,
    loadTasks,
    setTaskStatus,
    uploadPhoto,
    loadZones,
  }
})
