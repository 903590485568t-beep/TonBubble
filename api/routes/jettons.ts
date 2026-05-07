import { Router, type Request, type Response } from 'express'

type CacheEntry<T> = {
  expiresAt: number
  value: T
}

const router = Router()

const cache = new Map<string, CacheEntry<unknown>>()

function getCacheTtlMs(): number {
  const raw = process.env.CACHE_TTL_SECONDS
  const parsed = raw ? Number(raw) : NaN
  if (Number.isFinite(parsed) && parsed > 0) return parsed * 1000
  return 120_000
}

function cacheGet<T>(key: string): T | undefined {
  const entry = cache.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return undefined
  }
  return entry.value as T
}

function cacheSet(key: string, value: unknown): void {
  cache.set(key, { expiresAt: Date.now() + getCacheTtlMs(), value })
}

function tonapiBaseUrl(): string {
  const base = process.env.TONAPI_BASE_URL?.trim()
  return base && base.length > 0 ? base.replace(/\/+$/, '') : 'https://tonapi.io'
}

function tonapiHeaders(): HeadersInit {
  const headers: Record<string, string> = { accept: 'application/json' }
  const key = process.env.TONAPI_KEY?.trim()
  if (key) headers.authorization = `Bearer ${key}`
  return headers
}

async function tonapiGetJson<T>(path: string, searchParams: URLSearchParams): Promise<T> {
  const url = new URL(`${tonapiBaseUrl()}${path}`)
  url.search = searchParams.toString()
  const cacheKey = url.toString()
  const cached = cacheGet<T>(cacheKey)
  if (cached) return cached

  const res = await fetch(url, {
    headers: tonapiHeaders(),
    signal: AbortSignal.timeout(20_000),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`TonAPI error ${res.status}: ${text.slice(0, 300)}`)
  }

  const json = (await res.json()) as T
  cacheSet(cacheKey, json)
  return json
}

function normalizeJettonMeta(address: string, raw: unknown) {
  const obj = raw as Record<string, unknown>
  const metadata = (obj?.metadata ?? obj?.meta ?? obj?.jetton) as
    | Record<string, unknown>
    | undefined

  const decimalsRaw = (metadata?.decimals ?? obj?.decimals) as unknown
  const decimals =
    typeof decimalsRaw === 'number' ? decimalsRaw
    : typeof decimalsRaw === 'string' ? Number(decimalsRaw)
    : undefined

  const totalSupplyRaw =
    (obj?.total_supply as string | number | undefined) ??
    (obj?.totalSupply as string | number | undefined) ??
    (metadata?.total_supply as string | number | undefined)

  const holdersCount =
    (obj?.holders_count as number | undefined) ??
    (obj?.holdersCount as number | undefined) ??
    (metadata?.holders_count as number | undefined)

  const image =
    (metadata?.image as string | undefined) ??
    (metadata?.image_url as string | undefined) ??
    (obj?.image as string | undefined) ??
    (obj?.image_url as string | undefined)

  return {
    address,
    name: (metadata?.name as string | undefined) ?? (obj?.name as string | undefined),
    symbol: (metadata?.symbol as string | undefined) ?? (obj?.symbol as string | undefined),
    decimals: Number.isFinite(decimals as number) ? (decimals as number) : undefined,
    totalSupplyRaw: totalSupplyRaw !== undefined ? String(totalSupplyRaw) : undefined,
    holdersCount,
    imageUrl: image,
  }
}

function toNumberSafe(raw: unknown): number {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : 0
  if (typeof raw === 'string') {
    const v = Number(raw)
    return Number.isFinite(v) ? v : 0
  }
  return 0
}

function toBigIntSafe(raw: unknown): bigint {
  try {
    if (typeof raw === 'bigint') return raw
    if (typeof raw === 'number') return BigInt(Math.trunc(raw))
    if (typeof raw === 'string') return BigInt(raw)
    return 0n
  } catch {
    return 0n
  }
}

function bigIntToApproxNumber(raw: bigint, decimals: number): number {
  const d = Math.max(0, Math.min(decimals, 30))
  const s = raw < 0n ? (-raw).toString() : raw.toString()
  if (d === 0) {
    const n = Number(s)
    return Number.isFinite(n) ? n : 0
  }

  const sign = raw < 0n ? -1 : 1
  if (s.length <= d) {
    const frac = s.padStart(d, '0').slice(0, 6)
    const n = Number(`0.${frac}`)
    return Number.isFinite(n) ? n * sign : 0
  }

  const intPart = s.slice(0, s.length - d)
  const fracPart = s.slice(s.length - d).slice(0, 6).padEnd(6, '0')
  const n = Number(`${intPart}.${fracPart}`)
  return Number.isFinite(n) ? n * sign : 0
}

function normalizeHolders(
  address: string,
  meta: { decimals?: number; totalSupplyRaw?: string; holdersCount?: number },
  raw: unknown,
) {
  const obj = raw as Record<string, unknown>
  const holdersArray =
    (obj?.holders as unknown[]) ??
    (obj?.accounts as unknown[]) ??
    (obj?.addresses as unknown[]) ??
    (obj?.items as unknown[])

  const decimals = meta.decimals ?? 9
  const totalSupply = meta.totalSupplyRaw ? toBigIntSafe(meta.totalSupplyRaw) : 0n

  const holders =
    Array.isArray(holdersArray) ?
      holdersArray
        .map((h) => {
          const item = h as Record<string, unknown>

          const ownerValue = item?.owner as unknown
          const owner =
            (typeof ownerValue === 'string' ? ownerValue : undefined) ??
            (ownerValue && typeof ownerValue === 'object' ?
              ((ownerValue as Record<string, unknown>).address as string | undefined) :
              undefined) ??
            (item?.owner_address as string | undefined) ??
            (item?.account as string | undefined) ??
            ''

          const balanceRaw =
            (item?.balance as string | number | undefined) ??
            (item?.balance_raw as string | number | undefined) ??
            (item?.amount as string | number | undefined) ??
            '0'

          const big = toBigIntSafe(balanceRaw)
          const balance = bigIntToApproxNumber(big, decimals)

          const share =
            totalSupply > 0n ?
              Number((big * 1_000_000_000n) / totalSupply) / 1_000_000_000 :
              (item?.share as number | undefined) ??
                (item?.percent as number | undefined) ??
                0

          return {
            ownerAddress: owner,
            balanceRaw: String(balanceRaw),
            balance,
            share: typeof share === 'number' ? share : toNumberSafe(share),
          }
        })
        .filter((h) => h.ownerAddress.length > 0)
    : []

  const hasShare = holders.some((h) => h.share > 0)
  if (!hasShare) {
    const bigBalances = holders.map((h) => toBigIntSafe(h.balanceRaw))
    const total = bigBalances.reduce((acc, x) => acc + x, 0n)
    if (total > 0n) {
      const scale = 1_000_000_000n
      for (let i = 0; i < holders.length; i += 1) {
        const scaled = (bigBalances[i] * scale) / total
        holders[i].share = Number(scaled) / Number(scale)
      }
    }
  }

  return {
    jetton: { address, ...meta },
    holders,
    totalHolders:
      meta.holdersCount ??
      (obj?.total as number | undefined) ??
      (obj?.total_holders as number | undefined),
    source: 'tonapi' as const,
    fetchedAt: new Date().toISOString(),
  }
}

router.get('/:address/meta', async (req: Request, res: Response) => {
  try {
    const address = String(req.params.address || '').trim()
    if (!address) {
      res.status(400).json({ success: false, error: 'Missing address' })
      return
    }

    const raw = await tonapiGetJson<unknown>(`/v2/jettons/${encodeURIComponent(address)}`, new URLSearchParams())
    const meta = normalizeJettonMeta(address, raw)
    res.status(200).json({ success: true, data: meta })
  } catch (e) {
    res.status(502).json({
      success: false,
      error: e instanceof Error ? e.message : 'TonAPI request failed',
    })
  }
})

router.get('/:address/holders', async (req: Request, res: Response) => {
  try {
    const address = String(req.params.address || '').trim()
    if (!address) {
      res.status(400).json({ success: false, error: 'Missing address' })
      return
    }

    const max = Math.min(Math.max(Number(req.query.max ?? 1200) || 1200, 1), 10_000)
    const pageLimit = Math.min(Math.max(Number(req.query.pageLimit ?? 500) || 500, 1), 2000)
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined
    const offsetRaw = typeof req.query.offset === 'string' ? req.query.offset : undefined
    const offset = offsetRaw ? Math.max(0, Number(offsetRaw) || 0) : 0

    const metaRaw = await tonapiGetJson<unknown>(`/v2/jettons/${encodeURIComponent(address)}`, new URLSearchParams())
    const meta = normalizeJettonMeta(address, metaRaw)

    const items: unknown[] = []
    let nextCursor: string | undefined = cursor
    let nextOffset = offset
    let totalHolders: number | undefined

    for (let i = 0; i < 20 && items.length < max; i += 1) {
      const limit = Math.min(pageLimit, max - items.length)
      const sp = new URLSearchParams()
      sp.set('limit', String(limit))
      if (nextCursor) sp.set('cursor', nextCursor)
      else sp.set('offset', String(nextOffset))

      const pageRaw = await tonapiGetJson<unknown>(
        `/v2/jettons/${encodeURIComponent(address)}/holders`,
        sp,
      )

      const pageObj = pageRaw as Record<string, unknown>
      const pageItems =
        (pageObj?.holders as unknown[]) ??
        (pageObj?.accounts as unknown[]) ??
        (pageObj?.addresses as unknown[]) ??
        (pageObj?.items as unknown[]) ??
        []

      if (!Array.isArray(pageItems) || pageItems.length === 0) break
      items.push(...pageItems)

      totalHolders =
        (pageObj?.total as number | undefined) ??
        (pageObj?.total_holders as number | undefined) ??
        totalHolders

      const cursorFromResponse =
        (pageObj?.next as string | undefined) ??
        (pageObj?.cursor as string | undefined) ??
        (pageObj?.next_cursor as string | undefined)

      if (cursorFromResponse && typeof cursorFromResponse === 'string') {
        if (cursorFromResponse === nextCursor) break
        nextCursor = cursorFromResponse
      } else {
        nextCursor = undefined
        nextOffset += pageItems.length
        if (pageItems.length < limit) break
      }
    }

    const data = normalizeHolders(address, meta, { holders: items, total: totalHolders })
    res.status(200).json({ success: true, data })
  } catch (e) {
    res.status(502).json({
      success: false,
      error: e instanceof Error ? e.message : 'TonAPI request failed',
    })
  }
})

export default router
