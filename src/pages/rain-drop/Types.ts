export type UnknownProps = Record<string, any>

export interface ImageSourceType {
  name: string
  src: string
}

export interface ImageType {
  name: string
  src: string
  img: HTMLImageElement
}

export interface ImageExportType {
  [key: string]: {
    img: HTMLImageElement
    src: string
  }
}

export interface RaindropsOptionsType {
  minR: number
  maxR: number
  maxDrops: number
  rainChance: number
  rainLimit: number
  dropletsRate: number
  dropletsSize: [number, number]
  dropletsCleaningRadiusMultiplier: number
  raining: boolean
  globalTimeScale: number
  trailRate: number
  autoShrink: boolean
  spawnArea: number[]
  trailScaleRange: number[]
  collisionRadius: number
  collisionRadiusIncrease: number
  dropFallMultiplier: number
  collisionBoostMultiplier: number
  collisionBoost: number
}

export interface DropType {
  x: number
  y: number
  r: number
  spreadX: number
  spreadY: number
  momentum: number
  momentumX: number
  lastSpawn: number
  nextSpawn: number
  parent: DropType | null
  isNew: boolean
  killed: boolean
  shrink: number
}

export interface RainRendererOptionsType {
  renderShadow: boolean
  minRefraction: number
  maxRefraction: number
  brightness: number
  alphaMultiply: number
  alphaSubtract: number
  parallaxBg: number
  parallaxFg: number
}

export type WeatherTypes = 'rain' | 'storm' | 'fallout' | 'sunny' | 'drizzle'
