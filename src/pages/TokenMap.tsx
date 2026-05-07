import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Shell } from '@/components/Shell'
import { StickerButton } from '@/components/StickerButton'
import { TokenHeader } from '@/components/TokenHeader'
import { BubbleMapCanvas } from '@/components/BubbleMapCanvas'
import { ControlsPanel } from '@/components/ControlsPanel'
import { AnalyticsPanel } from '@/components/AnalyticsPanel'
import { ExportPanel } from '@/components/ExportPanel'
import { useTonBublleStore } from '@/store/useTonBublleStore'
import { RefreshCcw } from 'lucide-react'

export default function TokenMap() {
  const params = useParams()
  const address = String(params.address || '').trim()

  const status = useTonBublleStore((s) => s.status)
  const error = useTonBublleStore((s) => s.error)
  const data = useTonBublleStore((s) => s.data)
  const load = useTonBublleStore((s) => s.loadByAddress)
  const clearError = useTonBublleStore((s) => s.clearError)

  useEffect(() => {
    if (!address) return
    load(address)
  }, [address, load])

  return (
    <Shell>
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TokenHeader address={address} jetton={data?.jetton ?? null} />
          <div className="flex items-center gap-2">
            <StickerButton
              tone="chalk"
              onClick={() => load(address)}
              disabled={!address || status === 'loading'}
            >
              <RefreshCcw className="h-4 w-4" />
              ПЕРЕДУТЬ
            </StickerButton>
          </div>
        </div>

        {error && (
          <div className="tb-card-readable border-2 border-ton-red !bg-ton-ice p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-kid text-[13px] text-ton-chalk">
                ошибка: <span className="text-ton-chalk">{error}</span>
              </div>
              <StickerButton tone="chalk" onClick={clearError}>
                ОК Я ПОНЯЛ
              </StickerButton>
            </div>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <section className="tb-card-readable border-2 border-ton-red !bg-ton-ice p-2">
            <div className="border-2 border-ton-chalk/20 !bg-ton-ice p-2">
              <BubbleMapCanvas
                status={status}
                holders={data?.holders ?? []}
                totalHolders={data?.totalHolders}
              />
            </div>
          </section>

          <aside className="grid gap-4">
            <ControlsPanel disabled={status === 'loading'} />
            <AnalyticsPanel status={status} data={data} />
            <ExportPanel status={status} data={data} />
          </aside>
        </div>
      </div>
    </Shell>
  )
}
