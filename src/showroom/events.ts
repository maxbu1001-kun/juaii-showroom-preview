export type ProductId = 'j03-01' | 'j02-01'

export type ShowroomHooks = {
  /**
   * Fires when a product hotspot opens its fact card.
   * Guide audio maps these ids to `public/audio/J03-01.mp3` and `J02-01.mp3`.
   */
  onHotspotOpen?: (productId: ProductId) => void
  /** Fires when that product's fact card closes, including when another card replaces it. */
  onCardClose?: (productId: ProductId) => void
}

const listeners = new Set<ShowroomHooks>()

export function subscribeShowroomEvents(hooks: ShowroomHooks): () => void {
  listeners.add(hooks)
  return () => {
    listeners.delete(hooks)
  }
}

export function onHotspotOpen(productId: ProductId): void {
  for (const listener of listeners) listener.onHotspotOpen?.(productId)
}

export function onCardClose(productId: ProductId): void {
  for (const listener of listeners) listener.onCardClose?.(productId)
}
