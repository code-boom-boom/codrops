import { RainRendererOptionsType } from './Types'
import vertShader from './shaders/simple.vert?raw'
import fragShader from './shaders/water.frag?raw'
import GL from './GL'
import createCanvas from './createCanvas'

const defaultOptions: RainRendererOptionsType = {
  renderShadow: false,
  minRefraction: 256,
  maxRefraction: 512,
  brightness: 1,
  alphaMultiply: 20,
  alphaSubtract: 5,
  parallaxBg: 5,
  parallaxFg: 20
}

export default class RainRenderer {
  canvas: HTMLCanvasElement
  canvasLiquid: HTMLCanvasElement
  options: RainRendererOptionsType
  width = 0
  height = 0
  gl: GL | null = null
  programWater: WebGLProgram | null = null
  imageShine: HTMLCanvasElement | null
  imageFg: HTMLCanvasElement
  imageBg: HTMLCanvasElement
  textures: {
    name: string
    img: HTMLCanvasElement
  }[] = []
  parallaxX = 0
  parallaxY = 0

  constructor(
    canvas: HTMLCanvasElement,
    canvasLiquid: HTMLCanvasElement,
    imageFg: HTMLCanvasElement,
    imageBg: HTMLCanvasElement,
    imageShine = null,
    options = {}
  ) {
    this.canvas = canvas
    this.canvasLiquid = canvasLiquid
    this.imageShine = imageShine
    this.imageFg = imageFg
    this.imageBg = imageBg
    this.options = { ...defaultOptions, ...options }
    this.init()
  }

  init() {
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.gl = new GL(this.canvas, { alpha: false }, vertShader, fragShader)
    const gl = this.gl
    this.programWater = gl.program

    gl.createUniform('2f', 'resolution', this.width, this.height)
    gl.createUniform(
      '1f',
      'textureRatio',
      this.imageBg.width / this.imageBg.height
    )
    gl.createUniform('1i', 'renderShine', this.imageShine != null)
    gl.createUniform('1i', 'renderShadow', this.options.renderShadow)
    gl.createUniform('1f', 'minRefraction', this.options.minRefraction)
    gl.createUniform(
      '1f',
      'refractionDelta',
      this.options.maxRefraction - this.options.minRefraction
    )
    gl.createUniform('1f', 'brightness', this.options.brightness)
    gl.createUniform('1f', 'alphaMultiply', this.options.alphaMultiply)
    gl.createUniform('1f', 'alphaSubtract', this.options.alphaSubtract)
    gl.createUniform('1f', 'parallaxBg', this.options.parallaxBg)
    gl.createUniform('1f', 'parallaxFg', this.options.parallaxFg)

    gl.createTexture(null, 0)

    this.textures = [
      {
        name: 'textureShine',
        img: this.imageShine == null ? createCanvas(2, 2) : this.imageShine
      },
      { name: 'textureFg', img: this.imageFg },
      { name: 'textureBg', img: this.imageBg }
    ]

    this.textures.forEach((texture, i) => {
      gl.createTexture(texture.img, i + 1)
      gl.createUniform('1i', texture.name, i + 1)
    })

    this.draw()
  }

  draw() {
    if (!this.programWater || !this.gl) return
    this.gl.useProgram(this.programWater)
    this.gl.createUniform('2f', 'parallax', this.parallaxX, this.parallaxY)
    this.updateTexture()
    this.gl.draw()

    requestAnimationFrame(this.draw.bind(this))
  }

  updateTextures() {
    this.textures.forEach((texture, i) => {
      if (!this.gl) return
      this.gl.activeTexture(i + 1)
      this.gl.updateTexture(texture.img)
    })
  }

  updateTexture() {
    if (!this.gl) return
    this.gl.activeTexture(0)
    this.gl.updateTexture(this.canvasLiquid)
  }
}
