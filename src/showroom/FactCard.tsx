import { useEffect, useRef } from 'react'
import type { Product } from './catalog'

export function FactCard({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [product.id])

  return (
    <aside
      className="fact-card"
      role="dialog"
      aria-labelledby="fact-card-title"
    >
      <div className="fact-card-top">
        <p className="fact-sku">{product.id}</p>
        <button ref={closeRef} type="button" className="fact-close" onClick={onClose}>
          Close
        </button>
      </div>
      <h2 id="fact-card-title">{product.name}</h2>
      <p className="fact-note">Geometric stand-in. Table values are placeholders.</p>
      <dl className="fact-list">
        {product.facts.map((fact) => (
          <div key={fact.label} className="fact-row">
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}
