import type { AddressCheckResult, Deal, DealStatus, FieldTask, TaskStatus } from './types'
import { mockDeals, mockTasks, mockZones } from './mockData'
import {
  fetchDealFromBitrix,
  fetchDealsFromBitrix,
  updateDealStageInBitrix,
} from './bitrixCrm'
import { waitForBx24, type Bx24Api } from '../bitrix/bx24'

/**
 * Единый API-слой:
 * - внутри Bitrix24 iframe → реальные crm.* через BX24
 * - локально вне Битрикса → mock (для разработки)
 */

const delay = (ms = 280) => new Promise((r) => setTimeout(r, ms))

let deals = structuredClone(mockDeals)
let tasks = structuredClone(mockTasks)
let bx24: Bx24Api | null = null
let mode: 'mock' | 'bitrix' = 'mock'

export function getDataMode() {
  return mode
}

export async function initDataLayer() {
  bx24 = await waitForBx24()
  mode = bx24 ? 'bitrix' : 'mock'
  return mode
}

export async function fetchDeals(): Promise<Deal[]> {
  if (mode === 'bitrix' && bx24) {
    return fetchDealsFromBitrix(bx24)
  }
  await delay()
  return structuredClone(deals)
}

export async function fetchDeal(id: string): Promise<Deal | undefined> {
  if (mode === 'bitrix' && bx24) {
    return fetchDealFromBitrix(bx24, id)
  }
  await delay()
  return structuredClone(deals.find((d) => d.id === id))
}

export async function updateDealStatus(id: string, status: DealStatus): Promise<Deal> {
  if (mode === 'bitrix' && bx24) {
    await updateDealStageInBitrix(bx24, id, status)
    const updated = await fetchDealFromBitrix(bx24, id)
    if (!updated) throw new Error('Сделка не найдена после обновления')
    return updated
  }

  await delay(200)
  const deal = deals.find((d) => d.id === id)
  if (!deal) throw new Error('Сделка не найдена')
  deal.status = status
  deal.history.unshift({
    id: `h-${Date.now()}`,
    at: new Date().toISOString(),
    channel: 'system',
    text: `Статус изменён на «${status}»`,
  })
  return structuredClone(deal)
}

export async function fetchTasks(): Promise<FieldTask[]> {
  await delay()
  return structuredClone(tasks)
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<FieldTask> {
  await delay(200)
  const task = tasks.find((t) => t.id === id)
  if (!task) throw new Error('Задача не найдена')
  task.status = status
  return structuredClone(task)
}

export async function addTaskPhoto(id: string, fileName: string): Promise<FieldTask> {
  await delay(200)
  const task = tasks.find((t) => t.id === id)
  if (!task) throw new Error('Задача не найдена')
  task.photos = [...task.photos, fileName]
  if (task.status !== 'done') task.status = 'photo'
  return structuredClone(task)
}

export async function checkAddress(address: string): Promise<AddressCheckResult> {
  await delay(350)
  const normalized = address.trim().toLowerCase()
  if (!normalized) {
    return {
      address,
      available: false,
      technology: '—',
      etaDays: null,
      zoneName: null,
    }
  }

  if (normalized.includes('независимости') || normalized.includes('победителей')) {
    return {
      address,
      available: true,
      technology: 'FTTH',
      etaDays: 2,
      zoneName: 'Центр FTTH',
    }
  }

  if (normalized.includes('коласа')) {
    return {
      address,
      available: true,
      technology: 'GPON',
      etaDays: 4,
      zoneName: 'Восток GPON',
    }
  }

  return {
    address,
    available: false,
    technology: 'Нет покрытия',
    etaDays: null,
    zoneName: null,
  }
}

export async function fetchCoverageZones() {
  await delay(150)
  return structuredClone(mockZones)
}

export async function syncBilling(dealId: string): Promise<Deal> {
  if (mode === 'bitrix' && bx24) {
    const deal = await fetchDealFromBitrix(bx24, dealId)
    if (!deal) throw new Error('Сделка не найдена')
    deal.history.unshift({
      id: `h-${Date.now()}`,
      at: new Date().toISOString(),
      channel: 'system',
      text: 'Запрошена синхронизация с биллингом (демо-хук в виджете)',
    })
    return deal
  }

  await delay(400)
  const deal = deals.find((d) => d.id === dealId)
  if (!deal) throw new Error('Сделка не найдена')
  deal.balance = Number((Math.random() * 80).toFixed(2))
  deal.connectionStatus = deal.status === 'done' ? 'online' : deal.connectionStatus
  deal.history.unshift({
    id: `h-${Date.now()}`,
    at: new Date().toISOString(),
    channel: 'system',
    text: `Биллинг синхронизирован. Баланс: ${deal.balance} BYN`,
  })
  return structuredClone(deal)
}
