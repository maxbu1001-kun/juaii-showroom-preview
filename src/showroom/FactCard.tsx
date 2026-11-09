import { useEffect, useRef } from 'react'
import { visitorFactFields, type Product } from './catalog'

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
      <p className="fact-note">Geometric stand-in. Facts are the visitor catalog.</p>
      <dl className="fact-list">
        {visitorFactFields.map((field) => (
          <div key={field.key} className="fact-row">
            <dt>{field.label}</dt>
            <dd>{product[field.key].en}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}
