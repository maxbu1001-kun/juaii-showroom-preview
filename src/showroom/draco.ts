/** Runtime decoder used by drei's `useGLTF`. Fetched only when a GLB actually loads. */
export const DRACO_DECODER_PATH =
  'https://www.gstatic.com/draco/versioned/decoders/1.5.7/'

export function modelPublicUrl(fileName: string): string {
  return `${import.meta.env.BASE_URL}models/${fileName}`
}
