import { cn } from '@/lib/utils'
import { CloudSvg } from '@/components/CloudSvg'

const CLOUDS = [
  { top: '6%', w: 320, delay: '-10s', opacity: 0.65, dir: 'a' as const },
  { top: '12%', w: 240, delay: '-24s', opacity: 0.55, dir: 'b' as const },
  { top: '20%', w: 280, delay: '-6s', opacity: 0.55, dir: 'a' as const },
  { top: '28%', w: 210, delay: '-18s', opacity: 0.5, dir: 'b' as const },
  { top: '38%', w: 300, delay: '-30s', opacity: 0.55, dir: 'a' as const },
  { top: '46%', w: 220, delay: '-14s', opacity: 0.45, dir: 'b' as const },
  { top: '56%', w: 260, delay: '-22s', opacity: 0.5, dir: 'a' as const },
  { top: '64%', w: 200, delay: '-8s', opacity: 0.42, dir: 'b' as const },
  { top: '72%', w: 240, delay: '-26s', opacity: 0.45, dir: 'a' as const },
  { top: '82%', w: 280, delay: '-16s', opacity: 0.42, dir: 'b' as const },
]

export function CloudBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/QzPo8ZUxQk6Prkeb.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute inset-0 bg-ton-ice/30" />

      {CLOUDS.map((c, idx) => (
        <div
          key={idx}
          className={cn(
            'absolute left-0 top-0',
            c.dir === 'a' ? 'tb-cloud-drift-a' : 'tb-cloud-drift-b',
          )}
          style={{
            top: c.top,
            width: `${c.w}px`,
            opacity: c.opacity,
            animationDelay: c.delay,
          }}
        >
          <div className={cn('tb-cloud-bob')} style={{ animationDelay: c.delay }}>
            <CloudSvg className="h-auto w-full" fill="#FFFFFF" stroke="#7B68EE" detailStroke="#D3D3D3" />
          </div>
        </div>
      ))}

      <div className="absolute inset-0 opacity-[0.55]">
        <div className="tb-bubble left-[8%] top-[32%] h-7 w-7 animate-floaty [animation-delay:0.3s]" />
        <div className="tb-bubble left-[86%] top-[34%] h-10 w-10 animate-floaty [animation-delay:1.1s]" />
        <div className="tb-bubble left-[62%] top-[78%] h-8 w-8 animate-floaty [animation-delay:0.8s]" />
        <div className="tb-bubble left-[22%] top-[86%] h-9 w-9 animate-floaty [animation-delay:1.6s]" />
        <div className="tb-bubble left-[42%] top-[22%] h-8 w-8 animate-floaty [animation-delay:0.9s]" />
        <div className="tb-bubble left-[52%] top-[44%] h-6 w-6 animate-floaty [animation-delay:1.7s]" />
        <div className="tb-bubble left-[16%] top-[54%] h-11 w-11 animate-floaty [animation-delay:1.3s]" />
        <div className="tb-bubble left-[74%] top-[12%] h-7 w-7 animate-floaty [animation-delay:0.6s]" />
      </div>
    </div>
  )
}
