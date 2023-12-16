export function getContext(canvas: HTMLCanvasElement, options = {}) {
  return canvas.getContext('webgl', options) as WebGLRenderingContext
}

export function createProgram(gl: WebGLRenderingContext, vertexScript: string, fragScript: string) {
  const vertexShader = createShader(gl, vertexScript, gl.VERTEX_SHADER)
  const fragShader = createShader(gl, fragScript, gl.FRAGMENT_SHADER)

  const program = gl.createProgram()
  if (!program || !vertexShader || !fragShader) return null
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragShader)

  gl.linkProgram(program)

  const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linked) {
    gl.deleteProgram(program)
    return null
  }

  const positionLocation = gl.getAttribLocation(program, 'a_position')
  const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord')

  const texCoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1.0, -1.0,
    1.0, -1.0,
    -1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    1.0, 1.0
  ]), gl.STATIC_DRAW)

  gl.enableVertexAttribArray(texCoordLocation)
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

  return program
}

export function createShader(gl: WebGLRenderingContext, script: string, type: number) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, script)
  gl.compileShader(shader)

  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

  if (!compiled) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function createUniform(gl: WebGLRenderingContext, program: WebGLProgram, type: string, name: string, ...args: any[]) {
  const location = gl.getUniformLocation(program, 'u_' + name)
  // @ts-ignore
  gl['uniform' + type](location, ...args)
}

export function createTexture(gl: WebGLRenderingContext, source: TexImageSource | null, i: number) {
  const texture = gl.createTexture()
  activeTexture(gl, i)
  gl.bindTexture(gl.TEXTURE_2D, texture)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  if (source === null) {
    return texture
  } else {
    updateTexture(gl, source)
  }

  return texture
}

export function activeTexture(gl: WebGLRenderingContext, i: number) {
  // @ts-ignore
  gl.activeTexture(gl['TEXTURE' + i])
}

export function updateTexture(gl: WebGLRenderingContext, source: TexImageSource) {
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
}

export function setRectangle(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number) {
  const x1 = x
  const x2 = x + width
  const y1 = y
  const y2 = y + height
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2]), gl.STATIC_DRAW)
}
