import type { ProductId } from './events'

export type ProductFactLabel =
  | 'Material'
  | 'Size'
  | 'Structure'
  | 'Use boundary'
  | 'Planned retail'

export type ProductFact = {
  label: ProductFactLabel
  value: string
}

export type Product = {
  id: ProductId
  name: string
  /**
   * Draco GLB under `public/models/`. Null keeps the geometric stand-in.
   * Intended filenames: `j03-01.glb`, `j02-01.glb`.
   */
  modelFile: string | null
  position: [number, number, number]
  plinth: [number, number, number]
  hotspot: [number, number, number]
  facts: readonly ProductFact[]
}

const placeholderFacts: readonly ProductFact[] = [
  { label: 'Material', value: 'TBD' },
  { label: 'Size', value: 'TBD' },
  { label: 'Structure', value: 'TBD' },
  { label: 'Use boundary', value: 'TBD' },
  { label: 'Planned retail', value: 'TBD' },
]

export const products: readonly Product[] = [
  {
    id: 'j03-01',
    name: 'Stainless steel tray',
    modelFile: null,
    position: [0.02, 0, 0.32],
    plinth: [0.74, 0.04, 0.54],
    hotspot: [0.18, 0.12, 0.3],
    facts: placeholderFacts,
  },
  {
    id: 'j02-01',
    name: 'Metal reading stand',
    modelFile: null,
    position: [0.92, 0, -0.28],
    plinth: [0.48, 0.04, 0.36],
    hotspot: [0.08, 0.12, 0.3],
    facts: placeholderFacts,
  },
]

export function findProduct(id: ProductId): Product {
  const product = products.find((item) => item.id === id)
  if (!product) throw new Error(`Unknown product ${id}`)
  return product
}
