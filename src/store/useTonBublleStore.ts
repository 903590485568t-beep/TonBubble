import { create } from 'zustand'

export type JettonMeta = {
  address: string
  name?: string
  symbol?: string
  decimals?: number
  totalSupplyRaw?: string
  holdersCount?: number
  imageUrl?: string
}

export type Holder = {
  ownerAddress: string
  balanceRaw: string
  balance: number
  share: number
  tags?: Array<'exchange' | 'contract' | 'unknown'>
}

export type HoldersResponse = {
  jetton: JettonMeta
  holders: Holder[]
  totalHolders?: number
  source: 'tonapi'
  fetchedAt: string
}

export type TonBublleSettings = {
  maxFetch: number
  pageLimit: number
  mapLimit: number
  aggregateBuckets: number
  chaosMode: boolean
  clusterMode: 'none' | 'tags'
}

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

type TonBublleState = {
  caInput: string
  settings: TonBublleSettings
  status: LoadStatus
  error: string | null
  data: HoldersResponse | null
  mapCanvas: HTMLCanvasElement | null
  setCaInput: (value: string) => void
  patchSettings: (patch: Partial<TonBublleSettings>) => void
  loadByAddress: (address: string) => Promise<void>
  clearError: () => void
  setMapCanvas: (el: HTMLCanvasElement | null) => void
}

async function apiGetJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { accept: 'application/json' } })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }
  return (await res.json()) as T
}

export const useTonBublleStore = create<TonBublleState>((set, get) => ({
  caInput: '',
  settings: {
    maxFetch: 1200,
    pageLimit: 500,
    mapLimit: 180,
    aggregateBuckets: 3,
    chaosMode: false,
    clusterMode: 'none',
  },
  status: 'idle',
  error: null,
  data: null,
  mapCanvas: null,
  setCaInput: (value) => set({ caInput: value }),
  patchSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
  clearError: () => set({ error: null }),
  setMapCanvas: (el) => set({ mapCanvas: el }),
  loadByAddress: async (address) => {
    const trimmed = address.trim()
    if (!trimmed) return
    const { settings } = get()
    set({ status: 'loading', error: null })
    try {
      const url =
        `/api/jettons/${encodeURIComponent(trimmed)}/holders` +
        `?max=${encodeURIComponent(String(settings.maxFetch))}` +
        `&pageLimit=${encodeURIComponent(String(settings.pageLimit))}`

      const res = await apiGetJson<{ success: boolean; data?: HoldersResponse; error?: string }>(url)
      if (!res.success || !res.data) throw new Error(res.error || 'API error')
      set({ status: 'ready', data: res.data })
    } catch (e) {
      set({
        status: 'error',
        error: e instanceof Error ? e.message : 'Ошибка загрузки',
        data: null,
      })
    }
  },
}))
