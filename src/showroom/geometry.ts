import { ExtrudeGeometry, Shape, type BufferGeometry } from 'three'

/** Flat rounded rectangle in the XZ plane, sitting on y = 0. */
export function roundedPlateGeometry(
  width: number,
  depth: number,
  radius: number,
  thickness: number,
): BufferGeometry {
  const shape = new Shape()
  const x = -width / 2
  const y = -depth / 2
  const r = Math.min(radius, width / 2 - 0.001, depth / 2 - 0.001)

  shape.moveTo(x + r, y)
  shape.lineTo(x + width - r, y)
  shape.absarc(x + width - r, y + r, r, -Math.PI / 2, 0, false)
  shape.lineTo(x + width, y + depth - r)
  shape.absarc(x + width - r, y + depth - r, r, 0, Math.PI / 2, false)
  shape.lineTo(x + r, y + depth)
  shape.absarc(x + r, y + depth - r, r, Math.PI / 2, Math.PI, false)
  shape.lineTo(x, y + r)
  shape.absarc(x + r, y + r, r, Math.PI, (Math.PI * 3) / 2, false)

  const geometry = new ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: false,
    curveSegments: 8,
    steps: 1,
  })
  geometry.rotateX(-Math.PI / 2)
  geometry.computeVertexNormals()
  return geometry
}
