import { cn } from '@/lib/utils'

export function CloudSvg(props: {
  className?: string
  fill?: string
  stroke?: string
  detailStroke?: string
}) {
  const fill = props.fill ?? '#FFFFFF'
  const stroke = props.stroke ?? '#0000FF'
  const detailStroke = props.detailStroke ?? '#D3D3D3'

  return (
    <svg
      viewBox="0 0 220 120"
      className={cn('block', props.className)}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M66 92H162C184 92 202 76 202 56C202 37 186 22 166 22C160 22 154 23 149 26C142 15 129 8 114 8C94 8 77 21 72 39C70 39 68 39 66 39C45 39 28 54 28 72C28 83 35 92 46 92H66Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M78 44C82 30 96 22 112 22C125 22 136 27 143 36"
        stroke={detailStroke}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
