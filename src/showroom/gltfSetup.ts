import { useGLTF } from '@react-three/drei'
import { DRACO_DECODER_PATH, modelPublicUrl } from './draco'

useGLTF.setDecoderPath(DRACO_DECODER_PATH)

export function preloadProductModel(fileName: string): void {
  useGLTF.preload(modelPublicUrl(fileName), DRACO_DECODER_PATH, false)
}
