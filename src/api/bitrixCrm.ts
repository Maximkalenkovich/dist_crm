import type { ContactEvent, Deal, DealStatus } from './types'
import { callBx24, type Bx24Api } from '../bitrix/bx24'

type BitrixDeal = {
  ID: string
  TITLE: string
  STAGE_ID?: string
  OPPORTUNITY?: string
  COMMENTS?: string
  DATE_CREATE?: string
  UF_CRM_ADDRESS?: string
}

type BitrixContact = {
  NAME?: string
  LAST_NAME?: string
  PHONE?: Array<{ VALUE: string }>
}

const stageToStatus = (stage?: string): DealStatus => {
  const s = (stage || '').toUpperCase()
  if (s.includes('WON') || s.includes('SUCCESS')) return 'done'
  if (s.includes('LOSE') || s.includes('LOST')) return 'rejected'
  if (s.includes('EXECUTING') || s.includes('WORK')) return 'in_progress'
  if (s.includes('NEW') || s.includes('PREPARATION')) return 'new'
  return 'check_address'
}

function mapDeal(deal: BitrixDeal, contact?: BitrixContact, timeline: ContactEvent[] = []): Deal {
  const phone = contact?.PHONE?.[0]?.VALUE || '—'
  const clientName = [contact?.NAME, contact?.LAST_NAME].filter(Boolean).join(' ') || 'Клиент Bitrix'
  return {
    id: String(deal.ID),
    title: deal.TITLE || `Сделка #${deal.ID}`,
    clientName,
    phone,
    address: deal.UF_CRM_ADDRESS || deal.COMMENTS || 'Адрес не указан',
    status: stageToStatus(deal.STAGE_ID),
    tariff: 'Тариф из CRM',
    balance: Number(deal.OPPORTUNITY || 0),
    connectionStatus: stageToStatus(deal.STAGE_ID) === 'done' ? 'online' : 'pending',
    createdAt: deal.DATE_CREATE || new Date().toISOString(),
    history: timeline,
  }
}

export async function fetchDealsFromBitrix(api: Bx24Api): Promise<Deal[]> {
  const list = await callBx24<BitrixDeal[]>(api, 'crm.deal.list', {
    order: { ID: 'DESC' },
    select: ['ID', 'TITLE', 'STAGE_ID', 'OPPORTUNITY', 'COMMENTS', 'DATE_CREATE', 'CONTACT_ID'],
    start: 0,
  })

  const deals = Array.isArray(list) ? list : []
  return deals.slice(0, 20).map((d) => mapDeal(d))
}

export async function fetchDealFromBitrix(api: Bx24Api, id: string): Promise<Deal | undefined> {
  const deal = await callBx24<BitrixDeal>(api, 'crm.deal.get', { id })
  if (!deal?.ID) return undefined

  let contact: BitrixContact | undefined
  const contactId = (deal as BitrixDeal & { CONTACT_ID?: string }).CONTACT_ID
  if (contactId) {
    try {
      contact = await callBx24<BitrixContact>(api, 'crm.contact.get', { id: contactId })
    } catch {
      contact = undefined
    }
  }

  const timeline: ContactEvent[] = [
    {
      id: 'bx-1',
      at: deal.DATE_CREATE || new Date().toISOString(),
      channel: 'system',
      text: 'Данные загружены из Bitrix24 CRM (crm.deal.get)',
    },
  ]

  try {
    const comments = await callBx24<Array<{ ID: string; COMMENT: string; CREATED: string }>>(
      api,
      'crm.timeline.comment.list',
      {
        filter: { ENTITY_ID: id, ENTITY_TYPE: 'deal' },
        order: { CREATED: 'DESC' },
      },
    )
    if (Array.isArray(comments)) {
      for (const c of comments.slice(0, 8)) {
        timeline.push({
          id: `c-${c.ID}`,
          at: c.CREATED,
          channel: 'chat',
          text: c.COMMENT,
        })
      }
    }
  } catch {
    // timeline optional
  }

  return mapDeal(deal, contact, timeline)
}

export async function updateDealStageInBitrix(
  api: Bx24Api,
  id: string,
  status: DealStatus,
): Promise<void> {
  const stageMap: Record<DealStatus, string> = {
    new: 'NEW',
    check_address: 'PREPARATION',
    in_progress: 'PREPAYMENT_INVOICE',
    install: 'EXECUTING',
    done: 'WON',
    rejected: 'LOSE',
  }

  await callBx24(api, 'crm.deal.update', {
    id,
    fields: {
      STAGE_ID: stageMap[status],
      COMMENTS: `Обновлено из Vue-виджета: ${status}`,
    },
  })
}
