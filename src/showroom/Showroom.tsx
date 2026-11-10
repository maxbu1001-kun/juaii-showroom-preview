import { Canvas } from '@react-three/fiber'
import { Component, useCallback, useEffect, useRef, useState, type ErrorInfo, type ReactNode } from 'react'
import { findProduct, products } from './catalog'
import { onCardClose, onHotspotOpen, subscribeShowroomEvents, type ProductId, type ShowroomHooks } from './events'
import { FactCard } from './FactCard'
import { playGuideClip, stopGuideClip, subscribeGuideAudio, type GuideAudioState } from './guideAudio'
import { ShowroomScene } from './Scene'

type BoundaryProps = { children: ReactNode; fallback: ReactNode }
type BoundaryState = { failed: boolean }

class CanvasErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false }

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Showroom scene failed', error, info)
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function Showroom({ onHotspotOpen: onHotspotOpenProp, onCardClose: onCardCloseProp }: ShowroomHooks = {}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const hooksRef = useRef<ShowroomHooks>({})

  useEffect(() => {
    hooksRef.current.onHotspotOpen = onHotspotOpenProp
    hooksRef.current.onCardClose = onCardCloseProp
  }, [onHotspotOpenProp, onCardCloseProp])

  const [openId, setOpenId] = useState<ProductId | null>(null)
  const openIdRef = useRef<ProductId | null>(null)
  const [webgl] = useState(hasWebGL)
  const [guide, setGuide] = useState<GuideAudioState>({
    clip: null,
    playing: false,
    autoplayBlocked: false,
  })

  useEffect(() => subscribeGuideAudio(setGuide), [])

  useEffect(() => {
    return subscribeShowroomEvents({
      onHotspotOpen: (productId) => {
        hooksRef.current.onHotspotOpen?.(productId)
        playGuideClip(productId)
      },
      onCardClose: (productId) => {
        hooksRef.current.onCardClose?.(productId)
        stopGuideClip()
      },
    })
  }, [])

  useEffect(() => {
    playGuideClip('welcome')
    return () => stopGuideClip()
  }, [])

  const dismissCard = useCallback((productId: ProductId) => {
    openIdRef.current = null
    setOpenId(null)
    onCardClose(productId)
    playGuideClip('close')
    rootRef.current?.focus()
  }, [])

  const closeCard = useCallback(() => {
    const current = openIdRef.current
    if (!current) return
    dismissCard(current)
  }, [dismissCard])

  const openProduct = useCallback((productId: ProductId) => {
    const current = openIdRef.current
    if (current === productId) {
      dismissCard(productId)
      return
    }
    if (current) onCardClose(current)
    openIdRef.current = productId
    setOpenId(productId)
    onHotspotOpen(productId)
  }, [dismissCard])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCard()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeCard])

  const openProductRecord = openId ? findProduct(openId) : null

  const fallback = (
    <div className="fallback">
      <p>This preview needs WebGL to show the room.</p>
      <div className="fallback-actions">
        {products.map((product) => (
          <button key={product.id} type="button" onClick={() => openProduct(product.id)}>
            <span>{product.id}</span>
            {product.name}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div
      ref={rootRef}
      className="showroom"
      tabIndex={-1}
      data-card-open={openProductRecord ? 'true' : 'false'}
      data-guide-clip={guide.clip ?? 'none'}
      data-guide-playing={guide.playing ? 'true' : 'false'}
      data-guide-blocked={guide.autoplayBlocked ? 'true' : 'false'}
    >
      <header className="brand">
        <h1>JUΛII</h1>
        <p>具和安</p>
      </header>
      <div className="guide">
        <button
          type="button"
          aria-pressed={guide.clip === 'welcome'}
          onClick={() => {
            if (guide.clip === 'welcome') stopGuideClip()
            else playGuideClip('welcome')
          }}
        >
          {guide.autoplayBlocked && guide.clip !== 'welcome' ? 'Play welcome' : 'Welcome'}
        </button>
        <button
          type="button"
          aria-pressed={guide.clip === 'close'}
          onClick={() => {
            if (guide.clip === 'close') stopGuideClip()
            else playGuideClip('close')
          }}
        >
          Closing note
        </button>
        <p className="sr-only" aria-live="polite">
          {guide.clip
            ? `Playing ${guide.clip}`
            : guide.autoplayBlocked
              ? 'Play welcome to start the guide'
              : ''}
        </p>
      </div>
      {webgl ? (
        <CanvasErrorBoundary fallback={fallback}>
          <Canvas
            dpr={[1, 1.5]}
            frameloop="demand"
            camera={{ position: [1.62, 1.12, 1.74], fov: 30, near: 0.1, far: 40 }}
            gl={{
              antialias: true,
              alpha: false,
              stencil: false,
              powerPreference: 'high-performance',
              failIfMajorPerformanceCaveat: false,
            }}
            aria-label="JUΛII showroom corner. Drag to look around. Tap a ring to read and hear J03-01 or J02-01."
          >
            <ShowroomScene activeId={openId} onOpen={openProduct} />
          </Canvas>
        </CanvasErrorBoundary>
      ) : (
        fallback
      )}
      <p className="hint">
        {guide.autoplayBlocked
          ? 'Press Play welcome to start. Drag to look. Tap a ring for facts and the guide.'
          : 'Drag to look. Tap a ring for facts and the guide.'}
      </p>
      {openProductRecord ? <FactCard product={openProductRecord} onClose={closeCard} /> : null}
    </div>
  )
}
