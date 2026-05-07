import { Copy, ExternalLink } from 'lucide-react'
import { StickerButton } from '@/components/StickerButton'
import type { JettonMeta } from '@/store/useTonBublleStore'

export function TokenHeader(props: { address: string; jetton: JettonMeta | null }) {
  const { address, jetton } = props

  const title = jetton?.name || 'Jetton'
  const symbol = jetton?.symbol ? `$${jetton.symbol}` : '$???'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address)
    } catch {}
  }

  const viewer = `https://tonviewer.com/${encodeURIComponent(address)}`

  return (
    <div className="tb-card-readable flex min-w-0 flex-1 flex-wrap items-center gap-3 border-2 border-ton-red !bg-ton-ice px-4 py-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <div className="truncate font-title text-[22px] text-ton-chalk">{title}</div>
          <div className="font-mono text-[12px] text-ton-chalk/70">{symbol}</div>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <div className="max-w-[700px] truncate border-2 border-ton-chalk/20 !bg-ton-ice px-2 py-1 font-mono text-[11px] text-ton-chalk/80">
            {address}
          </div>
          <StickerButton tone="chalk" onClick={copy} className="px-2 py-1 text-[11px]">
            <Copy className="h-4 w-4" />
            COPY
          </StickerButton>
          <a href={viewer} target="_blank" rel="noreferrer">
            <StickerButton tone="chalk" className="px-2 py-1 text-[11px]">
              <ExternalLink className="h-4 w-4" />
              VIEW
            </StickerButton>
          </a>
        </div>
      </div>
    </div>
  )
}
