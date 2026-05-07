import { StickerButton } from '@/components/StickerButton'
import { useTonBublleStore } from '@/store/useTonBublleStore'
import { Bomb, Layers, RefreshCcw, SlidersHorizontal } from 'lucide-react'

export function ControlsPanel(props: { disabled?: boolean }) {
  const disabled = props.disabled ?? false
  const settings = useTonBublleStore((s) => s.settings)
  const patch = useTonBublleStore((s) => s.patchSettings)

  return (
    <div className="tb-card-readable border-2 border-ton-red/70 !bg-ton-ice p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 font-title text-[18px] text-ton-chalk">
          <SlidersHorizontal className="h-5 w-5" />
          РУЧКИ
        </div>
        <StickerButton
          tone="chalk"
          disabled={disabled}
          onClick={() =>
            patch({
              maxFetch: 1200,
              pageLimit: 500,
              mapLimit: 180,
              aggregateBuckets: 3,
              chaosMode: false,
              clusterMode: 'none',
            })
          }
          className="px-2 py-1 text-[11px]"
        >
          <RefreshCcw className="h-4 w-4" />
          RESET
        </StickerButton>
      </div>

      <div className="mt-4 grid gap-4">
        <div className="grid gap-2 border-2 border-ton-chalk/20 !bg-ton-ice p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 font-kid text-[12px] text-ton-chalk/80">
              <Layers className="h-4 w-4 text-ton-lime" />
              ПУЗЫРЕЙ НА КАРТЕ
            </div>
            <div className="font-mono text-[12px] text-ton-chalk/70">{settings.mapLimit}</div>
          </div>
          <input
            type="range"
            min={60}
            max={420}
            value={settings.mapLimit}
            disabled={disabled}
            onChange={(e) => patch({ mapLimit: Number(e.target.value) })}
            className="w-full accent-ton-red"
          />
        </div>

        <div className="grid gap-2 border-2 border-ton-chalk/20 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="font-kid text-[12px] text-ton-chalk/80">СКОЛЬКО ХОЛДЕРОВ ПОДГРУЗИТЬ</div>
            <div className="font-mono text-[12px] text-ton-chalk/70">{settings.maxFetch}</div>
          </div>
          <input
            type="range"
            min={200}
            max={6000}
            step={100}
            value={settings.maxFetch}
            disabled={disabled}
            onChange={(e) => patch({ maxFetch: Number(e.target.value) })}
            className="w-full accent-ton-lime"
          />
          <div className="font-mono text-[11px] text-ton-chalk/60">
            если токен огромный, без ключа TonAPI может ругаться лимитами
          </div>
        </div>

        <div className="grid gap-2 border-2 border-ton-chalk/20 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 font-kid text-[12px] text-ton-chalk/80">
              <Bomb className="h-4 w-4 text-ton-chalk" />
              ХАОС
            </div>
            <StickerButton
              tone={settings.chaosMode ? 'lime' : 'chalk'}
              disabled={disabled}
              onClick={() => patch({ chaosMode: !settings.chaosMode })}
              className="px-2 py-1 text-[11px]"
            >
              {settings.chaosMode ? 'ВКЛ' : 'ВЫКЛ'}
            </StickerButton>
          </div>
          <div className="font-mono text-[11px] text-ton-chalk/60">
            хаос = сильнее дрожит неон и физика чуть более дикая
          </div>
        </div>

        <div className="grid gap-2 border-2 border-ton-chalk/20 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="font-kid text-[12px] text-ton-chalk/80">КЛАСТЕРЫ</div>
            <StickerButton
              tone={settings.clusterMode === 'tags' ? 'lime' : 'chalk'}
              disabled={disabled}
              onClick={() => patch({ clusterMode: settings.clusterMode === 'tags' ? 'none' : 'tags' })}
              className="px-2 py-1 text-[11px]"
            >
              {settings.clusterMode === 'tags' ? 'ТЕГИ' : 'НЕТ'}
            </StickerButton>
          </div>
          <div className="font-mono text-[11px] text-ton-chalk/60">
            пока теги простые, но я умею делить пузырьки на группы
          </div>
        </div>
      </div>
    </div>
  )
}
