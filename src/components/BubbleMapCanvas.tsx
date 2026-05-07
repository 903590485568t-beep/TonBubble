import { useTonBublleStore } from '@/store/useTonBublleStore'
import type { Holder } from '@/store/useTonBublleStore'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useBubbleMap } from '@/hooks/useBubbleMap'

function pct(v: number): string {
  return `${(v * 100).toFixed(v >= 0.1 ? 2 : 4)}%`
}

export function BubbleMapCanvas(props: { status: string; holders: Holder[]; totalHolders?: number }) {
  const settings = useTonBublleStore((s) => s.settings)

  const map = useBubbleMap({
    holders: props.holders,
    status: props.status,
    totalHolders: props.totalHolders,
    mapLimit: settings.mapLimit,
    aggregateBuckets: settings.aggregateBuckets,
    chaosMode: settings.chaosMode,
  })

  return (
    <div ref={map.wrapRef} className="relative h-[540px] w-full">
      <div className="absolute left-2 top-2 z-10 flex flex-wrap items-center gap-2">
        <div className="border-2 border-ton-red !bg-ton-ice px-2 py-1 font-kid text-[12px] text-ton-chalk/80">
          {map.statusText}
        </div>
        {typeof props.totalHolders === 'number' && (
          <div className="border-2 border-ton-chalk/20 !bg-ton-ice px-2 py-1 font-mono text-[11px] text-ton-chalk/70">
            total: {props.totalHolders}
          </div>
        )}
        <div className="inline-flex items-center gap-2 border-2 border-ton-chalk/20 !bg-ton-ice px-2 py-1">
          <Search className="h-4 w-4 text-ton-lime" />
          <input
            value={map.query}
            onChange={(e) => map.setQuery(e.target.value)}
            placeholder="search addr..."
            className="w-[170px] bg-transparent font-mono text-[11px] text-ton-chalk/80 outline-none"
          />
        </div>
      </div>

      <canvas
        ref={map.canvasRef}
        className={cn(
          'h-full w-full border-2 border-ton-red/50 !bg-ton-ice',
          settings.chaosMode ? 'animate-canvasJitter' : '',
        )}
        onWheel={map.handlers.onWheel}
        onPointerDown={map.handlers.onPointerDown}
        onPointerMove={map.handlers.onPointerMove}
        onPointerUp={map.handlers.onPointerUp}
      />

      {map.hovered && map.pointer && (
        <div
          className="pointer-events-none fixed z-50 max-w-[360px] border-2 border-ton-lime !bg-ton-ice px-3 py-2 shadow-[0_0_18px_rgba(102,205,170,0.18)]"
          style={{ left: map.pointer.x + 14, top: map.pointer.y + 14 }}
        >
          <div className="font-kid text-[12px] text-ton-lime">
            {map.hovered.data.kind === 'aggregate' ? 'прочие' : 'холдер'}
          </div>
          <div className="mt-1 font-mono text-[11px] text-ton-chalk/85">{map.hovered.data.ownerAddress}</div>
          <div className="mt-1 font-mono text-[11px] text-ton-chalk">{pct(map.hovered.data.share)}</div>
        </div>
      )}
    </div>
  )
}
