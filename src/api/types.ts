export type DealStatus =
  | 'new'
  | 'check_address'
  | 'in_progress'
  | 'install'
  | 'done'
  | 'rejected'

export type TaskStatus = 'assigned' | 'on_site' | 'photo' | 'done'

export interface ContactEvent {
  id: string
  at: string
  channel: 'call' | 'chat' | 'email' | 'system'
  text: string
}

export interface Deal {
  id: string
  title: string
  clientName: string
  phone: string
  address: string
  status: DealStatus
  tariff: string
  balance: number
  connectionStatus: 'online' | 'offline' | 'pending'
  history: ContactEvent[]
  createdAt: string
}

export interface FieldTask {
  id: string
  dealId: string
  title: string
  address: string
  lat: number
  lng: number
  status: TaskStatus
  assignee: string
  photos: string[]
  dueAt: string
}

export interface CoverageZone {
  id: string
  name: string
  level: 'ftth' | 'gpon' | 'planned'
  points: Array<{ x: number; y: number }>
}

export interface AddressCheckResult {
  address: string
  available: boolean
  technology: string
  etaDays: number | null
  zoneName: string | null
}
