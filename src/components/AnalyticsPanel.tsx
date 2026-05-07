import type { HoldersResponse } from '@/store/useTonBublleStore'
import { BarChart3, Crown, Radar } from 'lucide-react'

function pct(v: number): string {
  if (!Number.isFinite(v)) return '0%'
  return `${(v * 100).toFixed(v >= 0.1 ? 2 : 4)}%`
}

function sumTop(items: { share: number }[], n: number): number {
  return items.slice(0, n).reduce((acc, x) => acc + (Number.isFinite(x.share) ? x.share : 0), 0)
}

export function AnalyticsPanel(props: { status: string; data: HoldersResponse | null }) {
  const data = props.data
  const holders = data?.holders ? [...data.holders] : []
  holders.sort((a, b) => (b.share || 0) - (a.share || 0))

  const top1 = holders[0]?.share ?? 0
  const top10 = sumTop(holders, 10)
  const top50 = sumTop(holders, 50)

  return (
    <div className="tb-card-readable border-2 border-ton-red/70 p-4" style={{ backgroundColor: '#AFEEEE' }}>
      <div className="inline-flex items-center gap-2 font-title text-[18px] text-ton-chalk">
        <BarChart3 className="h-5 w-5" />
        АНАЛИТИКА
      </div>

      <div className="mt-3 grid gap-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="border-2 border-ton-chalk/20 p-3" style={{ backgroundColor: '#AFEEEE' }}>
            <div className="font-kid text-[11px] text-ton-chalk/70">TOP1</div>
            <div className="mt-1 font-mono text-[12px] text-ton-chalk">{pct(top1)}</div>
          </div>
          <div className="border-2 border-ton-chalk/20 p-3" style={{ backgroundColor: '#AFEEEE' }}>
            <div className="font-kid text-[11px] text-ton-chalk/70">TOP10</div>
            <div className="mt-1 font-mono text-[12px] text-ton-chalk">{pct(top10)}</div>
          </div>
          <div className="border-2 border-ton-chalk/20 p-3" style={{ backgroundColor: '#AFEEEE' }}>
            <div className="font-kid text-[11px] text-ton-chalk/70">TOP50</div>
            <div className="mt-1 font-mono text-[12px] text-ton-chalk">{pct(top50)}</div>
          </div>
        </div>

        <div className="border-2 border-ton-chalk/20 p-3" style={{ backgroundColor: '#AFEEEE' }}>
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 font-kid text-[12px] text-ton-chalk/80">
              <Radar className="h-4 w-4 text-ton-lime" />
              ХОЛДЕРОВ В ДАННЫХ
            </div>
            <div className="font-mono text-[12px] text-ton-chalk/80">{holders.length}</div>
          </div>
          {typeof data?.totalHolders === 'number' && (
            <div className="mt-1 font-mono text-[11px] text-ton-chalk/60">
              всего по провайдеру: {data.totalHolders}
            </div>
          )}
        </div>

        <div className="border-2 border-ton-chalk/20 p-3" style={{ backgroundColor: '#AFEEEE' }}>
          <div className="inline-flex items-center gap-2 font-kid text-[12px] text-ton-chalk/80">
            <Crown className="h-4 w-4 text-ton-chalk" />
            ТОП ХОЛДЕРЫ
          </div>
          <div className="mt-2 grid gap-2">
            {holders.slice(0, 8).map((h, idx) => (
              <div
                key={`${h.ownerAddress}-${idx}`}
                className="grid grid-cols-[1fr_auto] gap-2 border-2 border-ton-red/25 px-2 py-2"
                style={{ backgroundColor: '#AFEEEE' }}
              >
                <div className="min-w-0 font-mono text-[11px] text-ton-chalk/80">
                  {h.ownerAddress}
                </div>
                <div className="font-mono text-[11px] text-ton-chalk">{pct(h.share)}</div>
              </div>
            ))}
            {holders.length === 0 && (
              <div className="font-kid text-[12px] text-ton-chalk/60">
                {props.status === 'loading' ? 'загружаю холдеров...' : 'пока пусто'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
