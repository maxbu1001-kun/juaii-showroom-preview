import type { ProductId } from './events'

export type GuideClipId = 'welcome' | ProductId | 'close'

export type GuideAudioState = {
  clip: GuideClipId | null
  /** True after the browser accepts `play()` and until the clip ends or is stopped. */
  playing: boolean
  /** True when the first welcome play was rejected for lack of a user gesture. */
  autoplayBlocked: boolean
}

/** Archive filenames. Hotspot ids stay lowercase; J03/J02 clips keep this casing. */
const FILE_NAME: Record<GuideClipId, string> = {
  welcome: 'welcome.mp3',
  'j03-01': 'J03-01.mp3',
  'j02-01': 'J02-01.mp3',
  close: 'close.mp3',
}

let generation = 0
let current: HTMLAudioElement | null = null
let state: GuideAudioState = { clip: null, playing: false, autoplayBlocked: false }
const listeners = new Set<(next: GuideAudioState) => void>()

function emit(): void {
  for (const listener of listeners) listener(state)
}

export function guideAudioUrl(id: GuideClipId): string {
  return `${import.meta.env.BASE_URL}audio/${FILE_NAME[id]}`
}

export function subscribeGuideAudio(listener: (next: GuideAudioState) => void): () => void {
  listeners.add(listener)
  listener(state)
  return () => {
    listeners.delete(listener)
  }
}

function halt(): void {
  const element = current
  current = null
  if (!element) return
  element.pause()
  element.removeAttribute('src')
  element.load()
}

function isNotAllowed(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'name' in error && error.name === 'NotAllowedError'
}

/** Stops whatever is playing, then starts this clip. Only one element exists at a time. */
export function playGuideClip(id: GuideClipId): void {
  const gen = ++generation
  halt()
  const element = new Audio(guideAudioUrl(id))
  element.preload = 'auto'
  current = element
  state = { clip: id, playing: false, autoplayBlocked: false }
  emit()

  const release = () => {
    if (gen !== generation) return
    if (current === element) current = null
    state = { ...state, clip: null, playing: false }
    emit()
  }

  element.addEventListener('ended', release)
  element.addEventListener('error', () => {
    if (gen !== generation) return
    console.error('Guide audio failed to load', guideAudioUrl(id))
    release()
  })

  void element.play().then(
    () => {
      if (gen !== generation) return
      state = { ...state, clip: id, playing: true }
      emit()
    },
    (error: unknown) => {
      if (gen !== generation) return
      element.pause()
      if (current === element) current = null
      const blocked = id === 'welcome' && isNotAllowed(error)
      state = {
        clip: null,
        playing: false,
        autoplayBlocked: blocked || state.autoplayBlocked,
      }
      emit()
      if (!isNotAllowed(error)) console.error('Guide audio failed to play', error)
    },
  )
}

export function stopGuideClip(): void {
  generation += 1
  halt()
  if (!state.clip && !state.playing) return
  state = { ...state, clip: null, playing: false }
  emit()
}
