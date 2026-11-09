import { useEffect, useMemo } from 'react'
import { roundedPlateGeometry } from './geometry'

function BrushedMetal({ highlighted }: { highlighted: boolean }) {
  return (
    <meshStandardMaterial
      color={highlighted ? '#f3f5f7' : '#e1e5e9'}
      emissive={highlighted ? '#3f3c38' : '#000000'}
      emissiveIntensity={highlighted ? 0.32 : 0}
      metalness={0.55}
      roughness={highlighted ? 0.3 : 0.4}
      envMapIntensity={0.42}
    />
  )
}

export function TrayStandIn({ highlighted }: { highlighted: boolean }) {
  const geometry = useMemo(() => roundedPlateGeometry(0.58, 0.4, 0.045, 0.014), [])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh geometry={geometry} position={[0, 0.001, 0]}>
      <BrushedMetal highlighted={highlighted} />
    </mesh>
  )
}

export function ReadingStandStandIn({ highlighted }: { highlighted: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.005, 0]}>
        <boxGeometry args={[0.32, 0.01, 0.2]} />
        <BrushedMetal highlighted={highlighted} />
      </mesh>
      <mesh position={[0, 0.018, 0.09]}>
        <boxGeometry args={[0.32, 0.026, 0.012]} />
        <BrushedMetal highlighted={highlighted} />
      </mesh>
      <mesh position={[0, 0.125, -0.006]} rotation={[-0.62, 0, 0]}>
        <boxGeometry args={[0.32, 0.24, 0.008]} />
        <BrushedMetal highlighted={highlighted} />
      </mesh>
    </group>
  )
}
