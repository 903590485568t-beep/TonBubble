import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AlertTriangle, CircleDot, ScrollText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CloudBackdrop } from '@/components/CloudBackdrop'
import { TonBubbleCardDock } from '@/components/TonBubbleCardDock'

const NAV = [
  { to: '/', label: 'НАДУТЬ', icon: CircleDot },
  { to: '/lore', label: 'LORE', icon: ScrollText },
]

export function Shell(props: { title?: string; children: ReactNode }) {
  const location = useLocation()
  const showDock = !location.pathname.startsWith('/token/')

  return (
    <div className="relative isolate min-h-dvh bg-ton-ice text-ton-chalk">
      <CloudBackdrop />

      <header className="sticky top-0 z-20 rounded-none border-b-2 border-ton-chalk bg-ton-gray shadow-[0_10px_26px_rgba(0,0,255,0.12)]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">
          <Link to="/" className="group inline-flex items-end gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border-2 border-ton-chalk bg-ton-gray shadow-[0_0_18px_rgba(123,104,238,0.18)]">
              <img
                src="/tonbubble-avatar.png"
                alt="TonBubble"
                className="h-9 w-9 object-cover"
                draggable={false}
              />
            </span>
            <span className="leading-none">
              <span className="block font-title text-[26px] tracking-wide drop-shadow-[0_0_14px_rgba(0,0,255,0.18)]">
                <span className="text-ton-chalk">Ton</span>
                <span className="text-ton-bg">Bubble</span>
              </span>
              <span className="block font-kid text-[12px] text-ton-chalk/70">
                я рисую карту холдеров и не стесняюсь
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            {NAV.map((n) => {
              const active = location.pathname === n.to
              const Icon = n.icon
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    'inline-flex items-center gap-2 border-2 px-3 py-2 font-kid text-[12px] uppercase tracking-wider transition-transform active:translate-y-[1px]',
                    'shadow-[0_0_18px_rgba(123,104,238,0.16)] hover:translate-y-[-1px]',
                    active ?
                      'border-ton-chalk bg-ton-gray text-ton-chalk' :
                      'border-ton-red bg-ton-gray text-ton-chalk',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              )
            })}
            <a
              href="https://tonapi.io/api-v2"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 border-2 border-ton-gray bg-ton-gray px-3 py-2 font-mono text-[11px] text-ton-chalk hover:border-ton-lime hover:text-ton-lime sm:inline-flex"
              aria-label="TonAPI swagger"
            >
              <AlertTriangle className="h-4 w-4" />
              API
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-4 py-6 pb-80 sm:pb-96">{props.children}</main>
      {showDock && <TonBubbleCardDock />}
    </div>
  )
}
