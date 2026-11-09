import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'
import { products, type Product } from './catalog'
import { installSoftEnvironment } from './lighting'
import type { ProductId } from './events'
import { modelPublicUrl } from './draco'
import { ProductModel } from './ProductModel'
import { ReadingStandStandIn, TrayStandIn } from './standins'

const ORBIT_TARGET: [number, number, number] = [0.42, 0.1, 0.04]
const WALL = '#f3f1ec'
const frameTarget = new Vector3()
const frameDirection = new Vector3()

function FrameView() {
  const bucket = useRef<'portrait' | 'landscape' | null>(null)
  const get = useThree((state) => state.get)
  const invalidate = useThree((state) => state.invalidate)

  useFrame(() => {
    const { camera, controls, size } = get()
    if (!(camera instanceof PerspectiveCamera) || !controls) return
    if (size.width < 2 || size.height < 2) return
    const portrait = size.width / Math.max(size.height, 1) < 0.95
    const next = portrait ? 'portrait' : 'landscape'
    if (bucket.current === next) return
    bucket.current = next

    const fov = portrait ? 48 : 30
    camera.fov = fov
    camera.updateProjectionMatrix()
    const aspect = size.width / Math.max(size.height, 1)
    const tanHalfFov = Math.tan(((fov * Math.PI) / 180) / 2)
    const neededWidth = portrait ? 2.25 : 1.95
    const distance = neededWidth / 2 / (tanHalfFov * aspect)

    frameTarget.set(0.42, portrait ? -0.55 : 0.1, 0.02)
    frameDirection.set(1.15, portrait ? 1.5 : 1.02, 1.65).normalize().multiplyScalar(distance)
    camera.position.copy(frameTarget).add(frameDirection)

    const orbit = controls as unknown as {
      target: Vector3
      minDistance: number
      maxDistance: number
      update: () => void
    }
    orbit.target.copy(frameTarget)
    orbit.minDistance = 1.7
    orbit.maxDistance = 8
    orbit.update()
    invalidate()
  })

  return null
}
const FLOOR = '#d5cfc3'
const PLINTH = '#ebe6de'

function Lighting() {
  const get = useThree((state) => state.get)
  const invalidate = useThree((state) => state.invalidate)

  useLayoutEffect(() => {
    const { gl, scene } = get()
    const cleanup = installSoftEnvironment(gl, scene)
    invalidate()
    return cleanup
  }, [get, invalidate])

  return (
    <>
      <hemisphereLight args={['#f6f8fb', '#e6dfd4', 0.78]} />
      <ambientLight color="#f7f6f3" intensity={0.32} />
      <directionalLight color="#f4f7fb" intensity={1.05} position={[2.8, 5.4, 3.4]} />
    </>
  )
}

function Room() {
  return (
    <group>
      <mesh position={[1.4, -0.002, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color={FLOOR} roughness={1} metalness={0} envMapIntensity={0} />
      </mesh>
      <mesh position={[2.2, 1.7, -1.28]}>
        <boxGeometry args={[8, 3.4, 0.08]} />
        <meshStandardMaterial color={WALL} roughness={1} metalness={0} envMapIntensity={0} />
      </mesh>
      <mesh position={[-1.28, 1.7, 2.2]}>
        <boxGeometry args={[0.08, 3.4, 8]} />
        <meshStandardMaterial color={WALL} roughness={1} metalness={0} envMapIntensity={0} />
      </mesh>
    </group>
  )
}

function setCursor(cursor: string) {
  document.body.style.cursor = cursor
}

function Hotspot({ active }: { active: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[active ? 0.046 : 0.056, 0.074, 48]} />
      <meshBasicMaterial color={active ? '#2a2826' : '#6a655f'} toneMapped={false} />
    </mesh>
  )
}

function StandIn({
  id,
  highlighted,
}: {
  id: ProductId
  highlighted: boolean
}) {
  if (id === 'j03-01') return <TrayStandIn highlighted={highlighted} />
  return <ReadingStandStandIn highlighted={highlighted} />
}

function ProductDisplay({
  product,
  active,
  onOpen,
}: {
  product: Product
  active: boolean
  onOpen: (productId: ProductId) => void
}) {
  const modelUrl = product.modelFile ? modelPublicUrl(product.modelFile) : null

  return (
    <group
      name={product.id}
      position={product.position}
      onClick={(event) => {
        event.stopPropagation()
        onOpen(product.id)
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        setCursor('pointer')
      }}
      onPointerOut={() => setCursor('')}
    >
      <mesh position={[0, product.plinth[1] / 2, 0]}>
        <boxGeometry args={product.plinth} />
        <meshStandardMaterial color={PLINTH} roughness={1} metalness={0} envMapIntensity={0} />
      </mesh>
      <group position={[0, product.plinth[1], 0]}>
        {modelUrl ? (
          <Suspense fallback={<StandIn id={product.id} highlighted={active} />}>
            <ProductModel url={modelUrl} />
          </Suspense>
        ) : (
          <StandIn id={product.id} highlighted={active} />
        )}
      </group>
      <group position={product.hotspot}>
        <Hotspot active={active} />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.001, 0]}
        >
          <circleGeometry args={[0.2, 24]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}

export function ShowroomScene({
  activeId,
  onOpen,
}: {
  activeId: ProductId | null
  onOpen: (productId: ProductId) => void
}) {
  useEffect(() => () => setCursor(''), [])

  return (
    <>
      <color attach="background" args={['#e8e5e0']} />
      <Lighting />
      <Room />
      {products.map((product) => (
        <ProductDisplay
          key={product.id}
          product={product}
          active={activeId === product.id}
          onOpen={onOpen}
        />
      ))}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.12}
        target={ORBIT_TARGET}
        minPolarAngle={0.85}
        maxPolarAngle={1.38}
        minAzimuthAngle={0.05}
        maxAzimuthAngle={1.25}
        minDistance={1.7}
        maxDistance={8}
        zoomSpeed={0.65}
        rotateSpeed={0.72}
      />
      <FrameView />
    </>
  )
}
