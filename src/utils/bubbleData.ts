import type { Holder } from '@/store/useTonBublleStore'

export type Bubble = {
  id: string
  label: string
  ownerAddress: string
  share: number
  balance: number
  kind: 'holder' | 'aggregate'
}

function clamp(n: number, a: number, b: number): number {
  return Math.min(Math.max(n, a), b)
}

export function buildBubbles(
  holders: Holder[],
  mapLimit: number,
  aggregateBuckets: number,
  totalHolders?: number,
): Bubble[] {
  const sorted = [...holders].sort((a, b) => (b.share || 0) - (a.share || 0))
  const top = sorted.slice(0, mapLimit)
  const rest = sorted.slice(mapLimit)
  const bubbles: Bubble[] = top.map((h) => ({
    id: h.ownerAddress,
    label: h.ownerAddress.slice(0, 6) + '...' + h.ownerAddress.slice(-6),
    ownerAddress: h.ownerAddress,
    share: h.share,
    balance: h.balance,
    kind: 'holder',
  }))

  const sumShare = (list: { share: number }[]) =>
    list.reduce((acc, x) => acc + (Number.isFinite(x.share) ? x.share : 0), 0)

  const sumBalance = (list: { balance: number }[]) =>
    list.reduce((acc, x) => acc + (Number.isFinite(x.balance) ? x.balance : 0), 0)

  let restCount = rest.length
  let restShare = sumShare(rest)
  let restBalance = sumBalance(rest)

  if (typeof totalHolders === 'number' && totalHolders > holders.length) {
    const fetchedShare = clamp(sumShare(sorted), 0, 1)
    const missingShare = clamp(1 - fetchedShare, 0, 1)
    restShare += missingShare
    restCount += totalHolders - holders.length
  }

  if (restCount <= 0 || restShare <= 0) return bubbles

  const buckets = clamp(aggregateBuckets, 1, 8)
  const weights = Array.from({ length: buckets }, (_, i) => {
    const v = buckets - i
    return v * v
  })
  const wsum = weights.reduce((acc, x) => acc + x, 0)

  for (let i = 0; i < buckets; i += 1) {
    const share = restShare * (weights[i] / wsum)
    const count = Math.max(1, Math.round(restCount * (weights[i] / wsum)))
    const balance = restBalance * (weights[i] / wsum)
    bubbles.push({
      id: `other-${i}`,
      label: `прочие ${i + 1}`,
      ownerAddress: `прочие ${count}`,
      share,
      balance,
      kind: 'aggregate',
    })
  }

  return bubbles
}

export function radiusFromShare(share: number): number {
  const s = Math.max(share, 0)
  return 10 + Math.sqrt(s) * 380
}
