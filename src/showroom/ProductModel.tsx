import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { DRACO_DECODER_PATH } from './draco'
import './gltfSetup'

/** Draco-compressed GLB. Meshopt is left off; models are expected to be Draco. */
export function ProductModel({ url }: { url: string }) {
  const gltf = useGLTF(url, DRACO_DECODER_PATH, false)
  const object = useMemo(() => gltf.scene.clone(true), [gltf.scene])
  return <primitive object={object} />
}
