import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function StickerButton(
  props: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'red' | 'chalk' | 'lime' },
) {
  const { className, tone = 'red', ...rest } = props
  const toneClass =
    tone === 'lime' ? 'border-ton-lime text-white shadow-[0_0_18px_rgba(102,205,170,0.18)]'
    : tone === 'chalk' ? 'border-ton-gray text-white shadow-[0_0_18px_rgba(175,238,238,0.28)]'
    : 'border-ton-red text-white shadow-[0_0_18px_rgba(123,104,238,0.22)]'

  return (
    <button
      {...rest}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl border-2 bg-ton-bg px-3 py-2 font-kid text-[12px] uppercase tracking-wider',
        'transition-transform hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-40 disabled:hover:translate-y-0',
        toneClass,
        className,
      )}
    />
  )
}
