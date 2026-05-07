export type SimNode<T> = {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  r: number
  data: T
  pinned: boolean
}

export type SimOptions = {
  centerStrength: number
  damping: number
  padding: number
  chaos: boolean
}

function key(cx: number, cy: number): string {
  return `${cx}|${cy}`
}

export function simStep<T>(nodes: SimNode<T>[], w: number, h: number, opts: SimOptions): void {
  if (nodes.length === 0) return

  const cx = w / 2
  const cy = h / 2
  const maxR = nodes.reduce((m, n) => Math.max(m, n.r), 0)
  const cellSize = Math.max(20, Math.ceil(maxR * 2 + opts.padding * 2))

  const grid = new Map<string, number[]>()
  for (let i = 0; i < nodes.length; i += 1) {
    const n = nodes[i]
    const gx = Math.floor(n.x / cellSize)
    const gy = Math.floor(n.y / cellSize)
    const k = key(gx, gy)
    const list = grid.get(k)
    if (list) list.push(i)
    else grid.set(k, [i])
  }

  const centerStrength = opts.centerStrength * (opts.chaos ? 0.75 : 1)
  const damping = opts.damping * (opts.chaos ? 0.92 : 1)
  const pad = opts.padding

  for (const n of nodes) {
    if (n.pinned) continue
    const ax = (cx - n.x) * centerStrength
    const ay = (cy - n.y) * centerStrength
    n.vx = (n.vx + ax) * damping
    n.vy = (n.vy + ay) * damping
    if (opts.chaos) {
      n.vx += (Math.random() - 0.5) * 0.15
      n.vy += (Math.random() - 0.5) * 0.15
    }
  }

  const neighborOffsets = [-1, 0, 1]
  for (let i = 0; i < nodes.length; i += 1) {
    const a = nodes[i]
    const gx = Math.floor(a.x / cellSize)
    const gy = Math.floor(a.y / cellSize)

    for (const ox of neighborOffsets) {
      for (const oy of neighborOffsets) {
        const list = grid.get(key(gx + ox, gy + oy))
        if (!list) continue
        for (const j of list) {
          if (j <= i) continue
          const b = nodes[j]

          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.hypot(dx, dy)
          const minDist = a.r + b.r + pad
          if (dist === 0 || dist >= minDist) continue

          const push = (minDist - dist) / minDist
          const nx = dx / dist
          const ny = dy / dist

          const pa = a.pinned ? 0 : 1
          const pb = b.pinned ? 0 : 1
          const sum = pa + pb
          if (sum === 0) continue

          const wa = pa / sum
          const wb = pb / sum

          if (!a.pinned) {
            a.x -= nx * push * 22 * wa
            a.y -= ny * push * 22 * wa
            a.vx -= nx * push * 0.8 * wa
            a.vy -= ny * push * 0.8 * wa
          }
          if (!b.pinned) {
            b.x += nx * push * 22 * wb
            b.y += ny * push * 22 * wb
            b.vx += nx * push * 0.8 * wb
            b.vy += ny * push * 0.8 * wb
          }
        }
      }
    }
  }

  for (const n of nodes) {
    if (!n.pinned) {
      n.x += n.vx
      n.y += n.vy
    }

    const bx = n.r + 8
    const by = n.r + 8
    if (n.x < bx) {
      n.x = bx
      n.vx *= -0.4
    }
    if (n.x > w - bx) {
      n.x = w - bx
      n.vx *= -0.4
    }
    if (n.y < by) {
      n.y = by
      n.vy *= -0.4
    }
    if (n.y > h - by) {
      n.y = h - by
      n.vy *= -0.4
    }
  }
}

