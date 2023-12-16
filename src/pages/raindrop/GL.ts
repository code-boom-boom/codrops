import * as WebGL from './WebGL'
import { UnknownProps } from './Types'

export default class GL {
  canvas: HTMLCanvasElement
  width: number
  height: number
  gl: WebGLRenderingContext
  program: WebGLProgram | null

  constructor(canvas: HTMLCanvasElement, options: UnknownProps, vert: string, frag: string) {
    this.canvas = canvas
    this.width = canvas.width
    this.height = canvas.height
    this.gl = WebGL.getContext(canvas, options)
    this.program = this.createProgram(vert, frag)
    if (this.program) {
      this.useProgram(this.program)
    }
  }

  createProgram(vert: string, frag: string) {
    return WebGL.createProgram(this.gl, vert, frag)
  }

  useProgram(program: WebGLProgram) {
    this.program = program
    this.gl.useProgram(program)
  }

  createTexture(source: HTMLCanvasElement | null, i: number) {
    WebGL.createTexture(this.gl, source, i)
  }

  createUniform(type: string, name: string, ...v: any[]) {
    if (!this.program) return
    WebGL.createUniform(this.gl, this.program, type, name, ...v)
  }

  activeTexture(i: number) {
    WebGL.activeTexture(this.gl, i)
  }

  updateTexture(source: TexImageSource) {
    WebGL.updateTexture(this.gl, source)
  }

  draw() {
    WebGL.setRectangle(this.gl, -1, -1, 2, 2)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
  }
}
