import { DropType, RaindropsOptionsType } from './Types'
import createCanvas from './createCanvas'

const dropSize = 64
const Drop: DropType = {
  x: 0,
  y: 0,
  r: 0,
  spreadX: 0,
  spreadY: 0,
  momentum: 0,
  momentumX: 0,
  lastSpawn: 0,
  nextSpawn: 0,
  parent: null,
  isNew: true,
  killed: false,
  shrink: 0
}

const defaultOptions: RaindropsOptionsType = {
  minR: 10,
  maxR: 40,
  maxDrops: 900,
  rainChance: 0.3,
  rainLimit: 3,
  dropletsRate: 50,
  dropletsSize: [2, 4],
  dropletsCleaningRadiusMultiplier: 0.43,
  raining: true,
  globalTimeScale: 1,
  trailRate: 1,
  autoShrink: true,
  spawnArea: [-0.1, 0.95],
  trailScaleRange: [0.2, 0.5],
  collisionRadius: 0.65,
  collisionRadiusIncrease: 0.01,
  dropFallMultiplier: 1,
  collisionBoostMultiplier: 0.05,
  collisionBoost: 1
}

export default class Raindrops {
  dropColor: HTMLImageElement
  dropAlpha: HTMLImageElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  width = 0
  height = 0
  scale = 0
  dropletsPixelDensity = 1
  droplets: HTMLCanvasElement | null = null
  dropletsCtx: CanvasRenderingContext2D | null = null
  dropletsCounter = 0
  drops = []
  dropsGfx: HTMLCanvasElement[] = []
  clearDropletsGfx = null
  textureCleaningIterations = 0
  lastRender = null
  options: RaindropsOptionsType | null = null

  constructor(
    width: number,
    height: number,
    scale: number,
    dropAlpha: HTMLImageElement,
    dropColor: HTMLImageElement,
    options = {}
  ) {
    this.width = width
    this.height = this.scale
    this.dropAlpha = dropAlpha
    this.dropColor = dropColor
    this.options = { ...defaultOptions, ...options }
    this.canvas = createCanvas(this.width, this.height)
    this.ctx = this.canvas.getContext('2d')
    this.init()
  }

  init() {
    this.droplets = createCanvas(
      this.width * this.dropletsPixelDensity,
      this.height * this.dropletsPixelDensity
    )
    this.dropletsCtx = this.droplets.getContext('2d')

    this.renderDropsGfx()
  }

  renderDropsGfx() {
    const dropBuffer = createCanvas(dropSize, dropSize)
    const dropBufferCtx = dropBuffer.getContext('2d')

    if (!dropBufferCtx) return
    this.dropsGfx = [...Array(255)].map((_, i) => {
      const drop = createCanvas(dropSize, dropSize)
      const dropCtx = drop.getContext('2d')

      dropBufferCtx.clearRect(0, 0, dropSize, dropSize)
      dropBufferCtx.drawImage(this.dropColor, 0, 0, dropSize, dropSize)

      return drop
    })
  }
}
