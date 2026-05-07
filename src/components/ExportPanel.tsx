import type { HoldersResponse } from '@/store/useTonBublleStore'
import { StickerButton } from '@/components/StickerButton'
import { useTonBublleStore } from '@/store/useTonBublleStore'
import { Copy, Download, ImageDown, Share2 } from 'lucide-react'

function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ExportPanel(props: { status: string; data: HoldersResponse | null }) {
  const canvas = useTonBublleStore((s) => s.mapCanvas)
  const data = props.data

  const exportJson = () => {
    if (!data) return
    downloadText(
      `tonbublle_${data.jetton.symbol || 'jetton'}_holders.json`,
      JSON.stringify(data, null, 2),
      'application/json',
    )
  }

  const exportPng = () => {
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `tonbublle_map.png`
    a.click()
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {}
  }

  return (
    <div className="tb-card-readable border-2 border-ton-red/70 !bg-ton-ice p-4">
      <div className="inline-flex items-center gap-2 font-title text-[18px] text-ton-chalk">
        <Share2 className="h-5 w-5" />
        ЭКСПОРТ
      </div>

      <div className="mt-4 grid gap-2">
        <StickerButton tone="chalk" onClick={exportJson} disabled={!data}>
          <Download className="h-4 w-4" />
          JSON холдеров
        </StickerButton>
        <StickerButton tone="chalk" onClick={exportPng} disabled={!canvas}>
          <ImageDown className="h-4 w-4" />
          PNG карты
        </StickerButton>
        <StickerButton tone="chalk" onClick={copyLink}>
          <Copy className="h-4 w-4" />
          СКОПИРОВАТЬ ССЫЛКУ
        </StickerButton>
      </div>
    </div>
  )
}
