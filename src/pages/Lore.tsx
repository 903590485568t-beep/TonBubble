import { Shell } from '@/components/Shell'
import { StickerButton } from '@/components/StickerButton'
import { ExternalLink, Heart, Skull, Sparkles } from 'lucide-react'
import { useMemo } from 'react'

export default function Lore() {
  const lines = useMemo(() => {
    const base = [
      'TonBublle это когда пузырь большой и ты такой ОГО',
      'я не аналитик, я художник кружочков',
      'если тебе страшно — включи safe mode (когда я его сделаю)',
      'неон красный потому что да',
      'я люблю прямые углы. круглые углы мне не нравятся',
      'TonBublle TonBublle TonBublle (заклинание)',
    ]
    return base.sort(() => Math.random() - 0.5).slice(0, 5)
  }, [])

  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="tb-card-readable border-2 border-ton-red p-5" style={{ backgroundColor: '#AFEEEE' }}>
          <div className="font-title text-[34px] text-ton-chalk">LORE & кнопки</div>
          <div className="mt-2 font-kid text-[14px] text-ton-chalk/80">
            тут я пишу как ребенок и оставляю следы от маркера
          </div>

          <div
            className="mt-6 grid gap-3 border-2 border-ton-chalk p-4"
            style={{ backgroundColor: '#AFEEEE' }}
          >
            {lines.map((t) => (
              <div
                key={t}
                className="border-2 border-ton-chalk px-3 py-2 font-kid text-[13px] shadow-[0_10px_22px_rgba(0,0,255,0.10)]"
                style={{ backgroundColor: '#AFEEEE' }}
              >
                {t}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <StickerButton tone="chalk" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Sparkles className="h-4 w-4" />
              НАВЕРХ
            </StickerButton>
            <StickerButton
              tone="chalk"
              onClick={() => {
                const text = 'TonBublle says: дуй пузырь'
                navigator.clipboard?.writeText(text).catch(() => {})
              }}
            >
              <Heart className="h-4 w-4" />
              СКОПИРОВАТЬ ЗАКЛИНАНИЕ
            </StickerButton>
            <StickerButton
              tone="chalk"
              onClick={() => {
                document.body.classList.toggle('ton-bublle-glitch')
              }}
            >
              <Skull className="h-4 w-4" />
              ГЛИЧ РЕЖИМ
            </StickerButton>
          </div>
        </section>

        <aside className="grid gap-4">
          <div className="tb-card-readable border-2 border-ton-red/70 p-5" style={{ backgroundColor: '#AFEEEE' }}>
            <div className="font-kid text-[12px] uppercase tracking-wider text-ton-chalk/70">ссылки</div>
            <div className="mt-3 grid gap-2">
              <a
                className="inline-flex items-center justify-between gap-2 border-2 border-ton-chalk/25 px-3 py-2 font-mono text-[12px] text-ton-chalk/80 hover:border-ton-lime/70 hover:text-ton-lime"
                style={{ backgroundColor: '#AFEEEE' }}
                href="https://ton.org/"
                target="_blank"
                rel="noreferrer"
              >
                ton.org <ExternalLink className="h-4 w-4" />
              </a>
              <a
                className="inline-flex items-center justify-between gap-2 border-2 border-ton-chalk/25 px-3 py-2 font-mono text-[12px] text-ton-chalk/80 hover:border-ton-lime/70 hover:text-ton-lime"
                style={{ backgroundColor: '#AFEEEE' }}
                href="https://tonapi.io/"
                target="_blank"
                rel="noreferrer"
              >
                tonapi.io <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="tb-card-readable border-2 border-ton-chalk/25 p-5" style={{ backgroundColor: '#AFEEEE' }}>
            <div className="font-title text-[18px] text-ton-chalk">TonBublle манифест</div>
            <div className="mt-2 space-y-2 font-kid text-[13px] text-ton-chalk/80">
              <p>я показываю карту. ты решаешь что делать.</p>
              <p>градиенты запрещены. круглые углы запрещены.</p>
              <p>если пузырь красный — он просто красный.</p>
            </div>
          </div>
        </aside>
      </div>
    </Shell>
  )
}
