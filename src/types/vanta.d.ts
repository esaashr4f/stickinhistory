declare module "vanta/dist/vanta.fog.min" {
  import type * as THREE from "three"

  export type VantaEffect = {
    destroy: () => void
    resize: () => void
    animationLoop: () => number
    req: number
  }

  const FOG: (options: Record<string, unknown> & { el: HTMLElement; THREE: typeof THREE }) => VantaEffect
  export default FOG
}
