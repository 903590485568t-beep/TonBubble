import { Send } from 'lucide-react'
import { StickerButton } from '@/components/StickerButton'

const TELEGRAM_URL = 'https://t.me/TonBubbleToken'
const FALLBACK_AVATAR_URL =
  'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=3D%20clay%20puffy%20bubble%20letters%20%22TON%20BUBBLE%22%2C%20cute%20volumetric%20white%20clouds%2C%20small%20transparent%20soap%20bubbles%2C%20turquoise%20sky%20background%2C%20toy%20style%2C%20clean%20composition%2C%20high%20detail%2C%20soft%20studio%20light%2C%20no%20text%20other%20than%20TON%20BUBBLE&image_size=square'

export function TonBubbleCardDock() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[380px] bg-ton-gray/80 backdrop-blur-[14px]"
        style={{
          maskImage: 'linear-gradient(to top, black 0%, black 75%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, black 75%, transparent 100%)',
        }}
      />
      <div className="pointer-events-auto relative mx-auto w-[min(1120px,calc(100vw-20px))] pb-4 pt-5">
        <div className="tb-card-readable border-2 border-ton-chalk bg-ton-gray/70 text-ton-chalk shadow-[0_22px_44px_rgba(123,104,238,0.22)] backdrop-blur-[16px]">
          <div className="grid grid-cols-[160px_1fr] gap-6 p-6 sm:grid-cols-[200px_1fr]">
            <div className="relative h-[140px] w-[140px] border-2 border-ton-chalk bg-ton-gray sm:h-[160px] sm:w-[160px]">
            <img
              src="/tonbubble-avatar.png"
              alt="TonBubble avatar"
              className="h-full w-full object-cover"
              draggable={false}
              onError={(e) => {
                if (e.currentTarget.src !== FALLBACK_AVATAR_URL) e.currentTarget.src = FALLBACK_AVATAR_URL
              }}
            />
            <div className="pointer-events-none absolute inset-0 border-2 border-ton-lime/70" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="font-title text-[28px] leading-none sm:text-[34px]">
                  <span className="text-ton-chalk">Ton</span>
                  <span className="text-ton-bg">Bubble</span>
                </div>
                <div className="mt-2 font-mono text-[14px] text-ton-chalk">$TONBUBBLE</div>
                <div className="mt-3 grid gap-1">
                  <div className="font-kid text-[14px] text-ton-chalk">CA: Soon...</div>
                  <div className="font-mono text-[12px] text-ton-chalk/80">
                    я уже дую пузырь. скоро будет CA и ссылка.
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-ton-chalk bg-ton-bg px-6 font-kid text-[13px] uppercase tracking-wider text-ton-chalk shadow-[0_14px_26px_rgba(0,0,255,0.20)] transition-transform hover:translate-y-[-1px] hover:border-ton-lime active:translate-y-[1px]"
                  aria-label="Telegram"
                >
                  <Send className="h-4 w-4 text-ton-chalk" />
                  TELEGRAM
                </a>
                <StickerButton
                  tone="lime"
                  onClick={() => navigator.clipboard?.writeText('CA: Soon...').catch(() => {})}
                  className="h-10 px-4 text-[12px]"
                >
                  COPY CA
                </StickerButton>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="tb-card-readable border-2 border-ton-chalk/30 bg-ton-bg px-3 py-2 font-mono text-[12px] text-ton-chalk/85">
                тикер: $TONBUBBLE
              </div>
              <div className="tb-card-readable border-2 border-ton-chalk/30 bg-ton-bg px-3 py-2 font-mono text-[12px] text-ton-chalk/85">
                chain: TON
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
