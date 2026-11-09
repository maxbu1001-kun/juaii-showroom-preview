import {
  Mesh,
  NeutralToneMapping,
  PMREMGenerator,
  type Material,
  type Scene,
  type WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

function disposeObject(root: RoomEnvironment) {
  root.traverse((node) => {
    if (!(node instanceof Mesh)) return
    node.geometry.dispose()
    const materials: Material[] = Array.isArray(node.material) ? node.material : [node.material]
    for (const material of materials) material.dispose()
  })
}

/** Soft daylight image-based light so brushed metal reads without an HDR download. */
export function installSoftEnvironment(gl: WebGLRenderer, scene: Scene): () => void {
  gl.toneMapping = NeutralToneMapping
  gl.toneMappingExposure = 1

  const pmrem = new PMREMGenerator(gl)
  const room = new RoomEnvironment()
  const texture = pmrem.fromScene(room, 0.04).texture
  scene.environment = texture
  scene.environmentIntensity = 0.42
  gl.setRenderTarget(null)
  disposeObject(room)
  pmrem.dispose()

  return () => {
    texture.dispose()
    if (scene.environment === texture) scene.environment = null
  }
}
