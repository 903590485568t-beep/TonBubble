import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shell } from '@/components/Shell'
import { StickerButton } from '@/components/StickerButton'
import { useTonBublleStore } from '@/store/useTonBublleStore'
import { Bomb, Sparkles, Wand2 } from 'lucide-react'

const PRESETS = [
  {
    label: 'TonBublle DEMO',
    address: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
  },
  {
    label: 'JETTON RANDOM',
    address: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const caInput = useTonBublleStore((s) => s.caInput)
  const setCaInput = useTonBublleStore((s) => s.setCaInput)
  const settings = useTonBublleStore((s) => s.settings)
  const patchSettings = useTonBublleStore((s) => s.patchSettings)

  const slogan = useMemo(() => {
    const variants = [
      'я дую пузырь и смотрю кто держит',
      'я рисую кружочки и они правду говорят',
      'TonBublle не судит, TonBublle показывает',
      'если кит, то я его увижу (наверное)',
      'всё мягкое и кругленькое, но без лишнего пафоса',
    ]
    return variants[Math.floor(Math.random() * variants.length)]
  }, [])

  const go = () => {
    const addr = caInput.trim()
    if (!addr) return
    navigate(`/token/${encodeURIComponent(addr)}`)
  }

  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section
          className="tb-card-readable border-2 border-ton-chalk p-5 shadow-[0_0_28px_rgba(123,104,238,0.16)]"
          style={{ backgroundColor: '#AFEEEE' }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="font-title text-[42px] leading-[0.95]">
                <span className="tb-title-white">TON</span>
                <span className="tb-title-black"> BUB</span>
                <span className="tb-title-white">LLE</span>
              </div>
              <div className="mt-2 max-w-[520px] font-kid text-[14px] text-ton-chalk/80">
                {slogan}
              </div>
            </div>
            <div
              className="tb-card-readable grid gap-2 border-2 border-ton-chalk p-3 shadow-[0_10px_22px_rgba(0,0,255,0.10)]"
              style={{ backgroundColor: '#AFEEEE' }}
            >
              <div className="font-kid text-[12px] text-ton-chalk/70">быстрые кнопки</div>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <StickerButton
                    key={p.label}
                    tone="chalk"
                    onClick={() => {
                      setCaInput(p.address)
                      navigate(`/token/${encodeURIComponent(p.address)}`)
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    {p.label}
                  </StickerButton>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <label className="font-kid text-[12px] uppercase tracking-wider text-ton-chalk/70">
              CA Jetton (адрес)
            </label>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                value={caInput}
                onChange={(e) => setCaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') go()
                }}
                placeholder="вставь сюда EQ... и нажми НАДУТЬ"
                className="h-12 w-full border-2 border-ton-chalk bg-ton-gray px-3 font-mono text-[12px] text-ton-chalk shadow-[0_0_22px_rgba(0,0,255,0.12)] outline-none focus:border-ton-lime"
              />
              <StickerButton onClick={go} className="h-12 px-5">
                <Wand2 className="h-4 w-4" />
                НАДУТЬ
              </StickerButton>
            </div>
          </div>

          <div
            className="tb-card-readable mt-6 grid gap-3 border-2 border-ton-chalk p-4 shadow-[0_10px_22px_rgba(0,0,255,0.10)]"
            style={{ backgroundColor: '#AFEEEE' }}
          >
            <div className="font-kid text-[12px] text-ton-chalk/70">режимы (живые кнопки)</div>
            <div className="flex flex-wrap gap-2">
              <StickerButton
                tone={settings.chaosMode ? 'lime' : 'chalk'}
                onClick={() => patchSettings({ chaosMode: !settings.chaosMode })}
              >
                <Bomb className="h-4 w-4" />
                {settings.chaosMode ? 'ХАОС ВКЛ' : 'ХАОС ВЫКЛ'}
              </StickerButton>
              <StickerButton
                tone={settings.clusterMode === 'tags' ? 'lime' : 'chalk'}
                onClick={() => patchSettings({ clusterMode: settings.clusterMode === 'tags' ? 'none' : 'tags' })}
              >
                КЛАСТЕРЫ
              </StickerButton>
              <StickerButton
                tone="chalk"
                onClick={() => patchSettings({ mapLimit: Math.min(settings.mapLimit + 40, 420) })}
              >
                + пузырей
              </StickerButton>
              <StickerButton
                tone="chalk"
                onClick={() => patchSettings({ mapLimit: Math.max(settings.mapLimit - 40, 60) })}
              >
                - пузырей
              </StickerButton>
            </div>
          </div>
        </section>

        <aside className="grid gap-6">
          <div className="tb-card-readable border-2 border-ton-red/70 p-5" style={{ backgroundColor: '#AFEEEE' }}>
            <div className="font-title text-[22px] text-ton-chalk">что это вообще</div>
            <div className="mt-2 space-y-2 font-kid text-[13px] text-ton-chalk/80">
              <p>ты вставляешь CA, а я беру холдеров и рисую Bubble Map.</p>
              <p>пузырь большой = держит много.</p>
              <p>пузырь маленький = держит чуть‑чуть, но тоже важный.</p>
            </div>
          </div>

          <div className="tb-card-readable border-2 border-ton-chalk/25 p-5" style={{ backgroundColor: '#AFEEEE' }}>
            <div className="font-kid text-[12px] uppercase tracking-wider text-ton-chalk/70">подсказка</div>
            <div className="mt-2 font-mono text-[11px] text-ton-chalk/75">
              если токен очень жирный по холдерам, я покажу топ‑пузырьки отдельно, а остальных соберу в “прочие”.
            </div>
          </div>
        </aside>
      </div>
    </Shell>
  )
}
