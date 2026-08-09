// ─────────────────────────────────────────────────────────────────────────────
// TequilAPI Client — Mysterium Network Node REST API wrapper
// Default: http://localhost:4050 (proxied via Vite /tequilapi)
// Docs: https://docs.mysterium.network/apis-sdks/tequilapitutorial
// ─────────────────────────────────────────────────────────────────────────────

const BASE = '/tequilapi'
const TIMEOUT_MS = 8000

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NodeHealthcheck {
  uptime: string
  process: number
  version: string
  buildInfo: {
    commit: string
    branch: string
    buildNumber: string
  }
}

export interface NodeStatus {
  status: 'Online' | 'Offline' | 'Pending'
  address: string
}

export interface Identity {
  id: string
  registrationStatus: 'Unregistered' | 'InProgress' | 'Registered'
  channelAddress: string
  balance: number
  earnings: number
  earningsTotal: number
}

export interface Session {
  id: string
  direction: 'Provided' | 'Consumed'
  consumerCountry: string
  consumerID: string
  providerID: string
  serviceType: string
  status: 'New' | 'Completed' | 'EstablishedConsumer' | 'EstablishedProvider'
  startedAt: string
  duration: number
  bytesReceived: number
  bytesSent: number
  tokens: number
}

export interface Earnings {
  earnings: { wei: string; human: string }
  earningsTotal: { wei: string; human: string }
}

export interface Service {
  id: string
  providerId: string
  type: string
  status: 'Running' | 'Starting' | 'NotRunning'
  proposal: {
    id: number
    providerId: string
    serviceType: string
    location: { country: string; city: string; asn: number; isp: string }
  }
  options: Record<string, unknown>
}

export interface NatStatus {
  status: string
  error?: string
}

export interface Connection {
  status: 'NotConnected' | 'Connecting' | 'Connected' | 'Disconnecting'
  sessionId?: string
  statistics?: {
    duration: number
    bytesReceived: number
    bytesSent: number
    tokensSpent: number
  }
}

export interface TransactorFees {
  registration: { wei: string; human: string }
  settlement: { wei: string; human: string }
  hermes: { wei: string; human: string }
}

// ─── Fetch Helper ─────────────────────────────────────────────────────────────

async function tequilaFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: controller.signal,
      ...options,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`TequilAPI ${path} → HTTP ${res.status}: ${text}`)
    }
    return res.json() as Promise<T>
  } finally {
    clearTimeout(timer)
  }
}

// ─── API Endpoints ────────────────────────────────────────────────────────────

export const TequilAPI = {
  /** GET /healthcheck — node uptime, version, build info */
  healthcheck: () => tequilaFetch<NodeHealthcheck>('/healthcheck'),

  /** GET /node/status — Online/Offline + identity address */
  nodeStatus: () => tequilaFetch<NodeStatus>('/node/status'),

  /** GET /identities — list all local identities */
  identities: () => tequilaFetch<{ identities: Identity[] }>('/identities'),

  /** GET /identities/current — current active identity */
  currentIdentity: () => tequilaFetch<Identity>('/identities/current'),

  /** GET /sessions — all session history */
  sessions: (params?: { pageSize?: number }) =>
    tequilaFetch<{ sessions: Session[]; paging: { totalItems: number; totalPages: number } }>(
      `/sessions?pageSize=${params?.pageSize ?? 20}`
    ),

  /** GET /services — running services */
  services: () => tequilaFetch<Service[]>('/services'),

  /** POST /services — start a service */
  startService: (providerId: string, type = 'wireguard') =>
    tequilaFetch<Service>('/services', {
      method: 'POST',
      body: JSON.stringify({ providerId, type }),
    }),

  /** DELETE /services/:id — stop a service */
  stopService: (id: string) =>
    tequilaFetch<void>(`/services/${id}`, { method: 'DELETE' }),

  /** GET /nat/status — NAT traversal status */
  natStatus: () => tequilaFetch<NatStatus>('/nat/status'),

  /** GET /connection — consumer VPN connection status */
  connection: () => tequilaFetch<Connection>('/connection'),

  /** POST /connection — connect to a provider */
  connect: (consumerID: string, providerID: string, serviceType = 'wireguard') =>
    tequilaFetch<Connection>('/connection', {
      method: 'PUT',
      body: JSON.stringify({ consumerID, providerID, serviceType }),
    }),

  /** DELETE /connection — disconnect */
  disconnect: () => tequilaFetch<void>('/connection', { method: 'DELETE' }),

  /** GET /transactor/fees — registration + settlement fees */
  fees: () => tequilaFetch<TransactorFees>('/transactor/fees'),

  /** Convenience: get node summary (health + identity + services + sessions) */
  async summary() {
    const [health, identity, services, sessions, nat] = await Promise.allSettled([
      TequilAPI.healthcheck(),
      TequilAPI.currentIdentity(),
      TequilAPI.services(),
      TequilAPI.sessions({ pageSize: 10 }),
      TequilAPI.natStatus(),
    ])
    return {
      health: health.status === 'fulfilled' ? health.value : null,
      identity: identity.status === 'fulfilled' ? identity.value : null,
      services: services.status === 'fulfilled' ? services.value : [],
      sessions: sessions.status === 'fulfilled' ? sessions.value.sessions : [],
      nat: nat.status === 'fulfilled' ? nat.value : null,
      online: health.status === 'fulfilled',
    }
  },
}

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

export function formatMyst(wei: string | number): string {
  const n = typeof wei === 'string' ? BigInt(wei) : BigInt(Math.round(Number(wei)))
  const myst = Number(n) / 1e18
  return `${myst.toFixed(6)} MYST`
}

// ─── PISO Price Oracle ────────────────────────────────────────────────────────
export const MYST_TO_PISO_RATE = 12.50 // 1 MYST = 12.50 PISO (Price Oracle Feed)

export function mystToPiso(mystAmount: number): number {
  return mystAmount * MYST_TO_PISO_RATE
}

export function formatMystInPiso(wei: string | number): { mystStr: string; pisoStr: string; rawPiso: number } {
  const n = typeof wei === 'string' ? BigInt(wei) : BigInt(Math.round(Number(wei)))
  const myst = Number(n) / 1e18
  const piso = myst * MYST_TO_PISO_RATE
  return {
    mystStr: `${myst.toFixed(4)} MYST`,
    pisoStr: `₱${piso.toFixed(2)} PISO`,
    rawPiso: piso,
  }
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`
}
