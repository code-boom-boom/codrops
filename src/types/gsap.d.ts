declare module 'gsap' {
  interface EaseFunction {
    (progress: number): number
  }

  interface Ease {
    easeIn: EaseFunction
    easeOut: EaseFunction
    easeInOut: EaseFunction
  }

  type TweenTarget = string | object | null

  export const Strong: Ease

  export class TweenMax {
    constructor()

    static to(targets: TweenTarget, duration: number, vars: object): TweenMax

    static killTweensOf(angle: object): TweenMax
  }
}
