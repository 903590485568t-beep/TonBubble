import { useEffect, useMemo, useRef, useState } from 'react'
import type { Holder } from '@/store/useTonBublleStore'
import { useTonBublleStore } from '@/store/useTonBublleStore'
import { simStep, type SimNode } from '@/utils/bubbleSim'
import { buildBubbles, radiusFromShare, type Bubble } from '@/utils/bubbleData'

type View = { scale: number; tx: number; ty: number }
type Drag =
  | { type: 'pan'; startX: number; startY: number; startTx: number; startTy: number }
  | { type: 'node'; id: string; keepPinned: boolean }
  | null

function clamp(n: number, a: number, b: number): number {
  return Math.min(Math.max(n, a), b)
}

export function useBubbleMap(args: {
  holders: Holder[]
  status: string
  totalHolders?: number
  mapLimit: number
  aggregateBuckets: number
  chaosMode: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const [size, setSize] = useState({ w: 800, h: 520 })
  const [query, setQuery] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null)

  const setMapCanvas = useTonBublleStore((s) => s.setMapCanvas)

  const viewRef = useRef<View>({ scale: 1, tx: 0, ty: 0 })
  const dragRef = useRef<Drag>(null)
  const scribbleRef = useRef<
    Array<{ x: number; y: number; w: number; h: number; rot: number; tone: 'red' | 'lime' | 'chalk' }>
  >([])

  const bubbles = useMemo(
    () => buildBubbles(args.holders, args.mapLimit, args.aggregateBuckets, args.totalHolders),
    [args.holders, args.mapLimit, args.aggregateBuckets, args.totalHolders],
  )

  const nodesRef = useRef<SimNode<Bubble>[]>([])
  const pinnedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const seed = []
    for (let i = 0; i < 24; i += 1) {
      const tone = i % 7 === 0 ? 'lime' : i % 3 === 0 ? 'chalk' : 'red'
      seed.push({
        x: Math.random() * 1,
        y: Math.random() * 1,
        w: 18 + Math.random() * 120,
        h: 8 + Math.random() * 80,
        rot: (Math.random() - 0.5) * 0.5,
        tone,
      })
    }
    scribbleRef.current = seed
  }, [])

  useEffect(() => {
    const pinned = pinnedRef.current
    const old = nodesRef.current
    const byId = new Map(old.map((n) => [n.id, n]))
    const next: SimNode<Bubble>[] = bubbles.map((b) => {
      const prev = byId.get(b.id)
      const r = radiusFromShare(b.share)
      return {
        id: b.id,
        data: b,
        r,
        x: prev ? prev.x : Math.random() * size.w,
        y: prev ? prev.y : Math.random() * size.h,
        vx: prev ? prev.vx : 0,
        vy: prev ? prev.vy : 0,
        pinned: pinned.has(b.id),
      }
    })
    nodesRef.current = next
  }, [bubbles, size.w, size.h])

  useEffect(() => {
    setMapCanvas(canvasRef.current)
    return () => setMapCanvas(null)
  }, [setMapCanvas])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect()
      setSize({
        w: Math.max(320, Math.floor(rect.width)),
        h: Math.max(360, Math.floor(rect.height)),
      })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      const { w, h } = size
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const view = viewRef.current
      const nodes = nodesRef.current

      simStep(nodes, w, h, {
        centerStrength: 0.0025,
        damping: 0.92,
        padding: 2.5,
        chaos: args.chaosMode,
      })

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#AFEEEE'
      ctx.fillRect(0, 0, w, h)

      ctx.save()
      ctx.translate(view.tx, view.ty)
      ctx.scale(view.scale, view.scale)

      for (const s of scribbleRef.current) {
        ctx.save()
        const sx = s.x * (w / view.scale)
        const sy = s.y * (h / view.scale)
        ctx.translate(sx, sy)
        ctx.rotate(s.rot)
        const stroke = s.tone === 'lime' ? 'rgba(102,205,170,0.55)' : 'rgba(123,104,238,0.45)'
        ctx.lineWidth = 2
        ctx.fillStyle = 'rgba(255,255,255,0.75)'
        ctx.strokeStyle = stroke
        const r = Math.max(10, Math.min(s.h, s.w) * 0.26)
        ctx.beginPath()
        ctx.arc(r * 1.2, r * 1.2, r * 1.1, 0, Math.PI * 2)
        ctx.arc(r * 2.2, r * 0.7, r * 1.35, 0, Math.PI * 2)
        ctx.arc(r * 3.2, r * 1.25, r * 1.05, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.restore()
      }

      const needle = query.trim().toLowerCase()
      for (const n of nodes) {
        const hot = hoveredId === n.id
        const match = needle ? n.data.ownerAddress.toLowerCase().includes(needle) : false

        const fill =
          n.data.kind === 'aggregate' ? 'rgba(211,211,211,0.35)' : 'rgba(175,238,238,0.55)'

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = fill
        ctx.fill()

        ctx.lineWidth = hot || match ? 3 : 2
        ctx.strokeStyle =
          hot ? 'rgba(102,205,170,0.95)'
          : match ? 'rgba(0,0,255,0.9)'
          : 'rgba(123,104,238,0.9)'

        ctx.shadowColor =
          hot ? 'rgba(102,205,170,0.45)' : match ? 'rgba(0,0,255,0.22)' : 'rgba(123,104,238,0.22)'
        ctx.shadowBlur = hot ? 26 : match ? 16 : 18
        ctx.stroke()
        ctx.shadowBlur = 0

        ctx.beginPath()
        ctx.arc(n.x - n.r * 0.28, n.y - n.r * 0.28, Math.max(6, n.r * 0.18), 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.65)'
        ctx.fill()

        ctx.beginPath()
        ctx.arc(n.x + n.r * 0.12, n.y + n.r * 0.18, Math.max(10, n.r * 0.78), 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255,255,255,0.22)'
        ctx.lineWidth = 2
        ctx.stroke()

        const shouldLabel = hot || match || n.data.kind === 'aggregate' || n.r > 44
        if (shouldLabel) {
          ctx.font = `12px var(--font-mono)`
          ctx.fillStyle = hot || match ? 'rgba(0,0,255,0.92)' : 'rgba(123,104,238,0.85)'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(n.data.label, n.x, n.y)
        }
      }

      ctx.restore()

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [size, args.chaosMode, hoveredId, query])

  const screenToWorld = (sx: number, sy: number) => {
    const v = viewRef.current
    return { x: (sx - v.tx) / v.scale, y: (sy - v.ty) / v.scale }
  }

  const hitTest = (wx: number, wy: number): SimNode<Bubble> | null => {
    const nodes = nodesRef.current
    for (let i = nodes.length - 1; i >= 0; i -= 1) {
      const n = nodes[i]
      if (Math.hypot(wx - n.x, wy - n.y) <= n.r) return n
    }
    return null
  }

  const onWheel: React.WheelEventHandler<HTMLCanvasElement> = (e) => {
    e.preventDefault()
    const { x: wx, y: wy } = screenToWorld(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    const v = viewRef.current
    const factor = e.deltaY > 0 ? 0.92 : 1.08
    const nextScale = clamp(v.scale * factor, 0.55, 2.4)
    const nextTx = e.nativeEvent.offsetX - wx * nextScale
    const nextTy = e.nativeEvent.offsetY - wy * nextScale
    viewRef.current = { scale: nextScale, tx: nextTx, ty: nextTy }
  }

  const onPointerDown: React.PointerEventHandler<HTMLCanvasElement> = (e) => {
    const { x: wx, y: wy } = screenToWorld(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    const hit = hitTest(wx, wy)
    if (hit) {
      const pinned = pinnedRef.current
      const keepPinned = pinned.has(hit.id)
      hit.pinned = true
      pinned.add(hit.id)
      dragRef.current = { type: 'node', id: hit.id, keepPinned }
      setHoveredId(hit.id)
    } else {
      const v = viewRef.current
      dragRef.current = {
        type: 'pan',
        startX: e.nativeEvent.offsetX,
        startY: e.nativeEvent.offsetY,
        startTx: v.tx,
        startTy: v.ty,
      }
    }
    ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove: React.PointerEventHandler<HTMLCanvasElement> = (e) => {
    setPointer({ x: e.clientX, y: e.clientY })
    const { x: wx, y: wy } = screenToWorld(e.nativeEvent.offsetX, e.nativeEvent.offsetY)

    const drag = dragRef.current
    if (drag?.type === 'pan') {
      const dx = e.nativeEvent.offsetX - drag.startX
      const dy = e.nativeEvent.offsetY - drag.startY
      viewRef.current = { ...viewRef.current, tx: drag.startTx + dx, ty: drag.startTy + dy }
      return
    }
    if (drag?.type === 'node') {
      const n = nodesRef.current.find((x) => x.id === drag.id)
      if (n) {
        n.x = wx
        n.y = wy
        n.vx *= 0.2
        n.vy *= 0.2
      }
      return
    }

    const hit = hitTest(wx, wy)
    setHoveredId(hit ? hit.id : null)
  }

  const onPointerUp: React.PointerEventHandler<HTMLCanvasElement> = (e) => {
    const drag = dragRef.current
    if (drag?.type === 'node') {
      const pinned = pinnedRef.current
      if (!drag.keepPinned) {
        pinned.delete(drag.id)
        const n = nodesRef.current.find((x) => x.id === drag.id)
        if (n) n.pinned = false
      }
    }
    dragRef.current = null
    ;(e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId)
  }

  const hovered = useMemo(() => {
    if (!hoveredId) return null
    return nodesRef.current.find((n) => n.id === hoveredId) ?? null
  }, [hoveredId, args.holders.length])

  const statusText =
    args.status === 'loading' ? 'надуваю...'
    : args.status === 'error' ? 'ой'
    : args.status === 'ready' ? 'готово'
    : '...'

  return {
    canvasRef,
    wrapRef,
    query,
    setQuery,
    hovered,
    pointer,
    setPointer,
    statusText,
    viewRef,
    handlers: {
      onWheel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
  }
}
