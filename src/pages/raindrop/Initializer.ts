import loadImages from './ImageLoader'
import Raindrops from './Raindrops'
import RainRenderer from './RainRenderer'
import createCanvas from './createCanvas'
import TweenLite from 'gsap'
import { UnknownProps, WeatherTypes } from './Types'
import { chance, random, times } from './Helpers'

let textureRainFg: CanvasImageSource,
  textureRainBg: CanvasImageSource,
  textureStormLightningFg: CanvasImageSource,
  textureStormLightningBg: CanvasImageSource,
  textureFalloutFg: CanvasImageSource,
  textureFalloutBg: CanvasImageSource,
  textureSunFg: CanvasImageSource,
  textureSunBg: CanvasImageSource,
  textureDrizzleFg: CanvasImageSource,
  textureDrizzleBg: CanvasImageSource,
  dropColor: HTMLImageElement,
  dropAlpha: HTMLImageElement

let textureFg: HTMLCanvasElement,
  textureFgCtx: CanvasRenderingContext2D | null,
  textureBg: HTMLCanvasElement,
  textureBgCtx: CanvasRenderingContext2D | null

const textureBgSize = {
  width: 384,
  height: 256
}
const textureFgSize = {
  width: 96,
  height: 64
}

let raindrops: Raindrops, renderer: RainRenderer, canvas: HTMLCanvasElement

const parallax = { x: 0, y: 0 }

let weatherData: UnknownProps
let curWeatherData: UnknownProps
const blend = { v: 0 }

const initializer = async (target: HTMLCanvasElement) => {
  canvas = target

  const images = await loadImages([
    { name: 'dropAlpha', src: 'assets/raindrop/drop-alpha.png' },
    { name: 'dropColor', src: 'assets/raindrop/drop-color.png' },

    {
      name: 'textureRainFg',
      src: 'assets/raindrop/weather/texture-rain-fg.png'
    },
    {
      name: 'textureRainBg',
      src: 'assets/raindrop/weather/texture-rain-bg.png'
    },

    {
      name: 'textureStormLightningFg',
      src: 'assets/raindrop/weather/texture-storm-lightning-fg.png'
    },
    {
      name: 'textureStormLightningBg',
      src: 'assets/raindrop/weather/texture-storm-lightning-bg.png'
    },

    {
      name: 'textureFalloutFg',
      src: 'assets/raindrop/weather/texture-fallout-fg.png'
    },
    {
      name: 'textureFalloutBg',
      src: 'assets/raindrop/weather/texture-fallout-bg.png'
    },

    {
      name: 'textureSunFg',
      src: 'assets/raindrop/weather/texture-sun-fg.png'
    },
    {
      name: 'textureSunBg',
      src: 'assets/raindrop/weather/texture-sun-bg.png'
    },

    {
      name: 'textureDrizzleFg',
      src: 'assets/raindrop/weather/texture-drizzle-fg.png'
    },
    {
      name: 'textureDrizzleBg',
      src: 'assets/raindrop/weather/texture-drizzle-bg.png'
    }
  ])
  textureRainFg = images.textureRainFg.img
  textureRainBg = images.textureRainBg.img
  textureFalloutFg = images.textureFalloutFg.img
  textureFalloutBg = images.textureFalloutBg.img
  textureStormLightningFg = images.textureStormLightningFg.img
  textureStormLightningBg = images.textureStormLightningBg.img
  textureSunFg = images.textureSunFg.img
  textureSunBg = images.textureSunBg.img
  textureDrizzleFg = images.textureDrizzleFg.img
  textureDrizzleBg = images.textureDrizzleBg.img
  dropColor = images.dropColor.img
  dropAlpha = images.dropAlpha.img

  generateTextures(textureRainFg, textureRainBg)

  init()
}

const init = () => {
  const dpi = window.devicePixelRatio
  canvas.width = window.innerWidth * dpi
  canvas.height = window.innerHeight * dpi
  canvas.style.width = window.innerWidth + 'px'
  canvas.style.height = window.innerHeight + 'px'

  raindrops = new Raindrops(
    canvas.width,
    canvas.height,
    dpi,
    dropAlpha,
    dropColor,
    {
      trailRate: 1,
      trailScaleRange: [0.2, 0.45],
      collisionRadius: 0.45,
      dropletsCleaningRadiusMultiplier: 0.28
    }
  )

  textureFg = createCanvas(textureFgSize.width, textureFgSize.height)
  textureFgCtx = textureFg.getContext('2d')
  textureBg = createCanvas(textureBgSize.width, textureBgSize.height)
  textureBgCtx = textureBg.getContext('2d')

  generateTextures(textureRainFg, textureRainBg)

  renderer = new RainRenderer(
    canvas,
    raindrops.canvas,
    textureFg,
    textureBg,
    null,
    {
      brightness: 1.04,
      alphaMultiply: 6,
      alphaSubtract: 3
    }
  )

  setupEvents()
}

const setupEvents = () => {
  setupParallax()
  setupWeather()
  setupFlash()
}

const setupParallax = () => {
  document.addEventListener('mousemove', (event) => {
    const x = event.pageX
    const y = event.pageY

    TweenLite.to(parallax, 1, {
      x: (x / canvas.width) * 2 - 1,
      y: (y / canvas.height) * 2 - 1,
      ease: 'power1.out',
      onUpdate: () => {
        renderer.parallaxX = parallax.x
        renderer.parallaxY = parallax.y
      }
    })
  })
}

const setupFlash = () => {
  setInterval(() => {
    if (chance(curWeatherData.flashChance)) {
      flash(
        curWeatherData.bg,
        curWeatherData.fg,
        curWeatherData.flashBg,
        curWeatherData.flashFg
      )
    }
  }, 500)
}

const setupWeather = () => {
  setupWeatherData()
}

const setupWeatherData = () => {
  const defaultWeather = {
    raining: true,
    minR: 20,
    maxR: 50,
    rainChance: 0.35,
    rainLimit: 6,
    dropletsRate: 50,
    dropletsSize: [3, 5.5],
    trailRate: 1,
    trailScaleRange: [0.25, 0.35],
    fg: textureRainFg,
    bg: textureRainBg,
    flashFg: null,
    flashBg: null,
    flashChance: 0,
    collisionRadiusIncrease: 0.0002
  }

  const weather = (data: UnknownProps) => {
    return { ...defaultWeather, ...data }
  }

  weatherData = {
    rain: weather({
      rainChance: 0.35,
      dropletsRate: 50,
      raining: true,
      fg: textureRainFg,
      bg: textureRainBg
    }),
    storm: weather({
      maxR: 55,
      rainChance: 0.4,
      dropletsRate: 80,
      dropletsSize: [3, 5.5],
      trailRate: 2.5,
      trailScaleRange: [0.25, 0.4],
      fg: textureRainFg,
      bg: textureRainBg,
      flashFg: textureStormLightningFg,
      flashBg: textureStormLightningBg,
      flashChance: 0.1
    }),
    fallout: weather({
      minR: 30,
      maxR: 60,
      rainChance: 0.35,
      dropletsRate: 20,
      trailRate: 4,
      fg: textureFalloutFg,
      bg: textureFalloutBg,
      collisionRadiusIncrease: 0
    }),
    drizzle: weather({
      minR: 10,
      maxR: 40,
      rainChance: 0.15,
      rainLimit: 2,
      dropletsRate: 10,
      dropletsSize: [3.5, 6],
      fg: textureDrizzleFg,
      bg: textureDrizzleBg
    }),
    sunny: weather({
      rainChance: 0,
      rainLimit: 0,
      droplets: 0,
      raining: false,
      fg: textureSunFg,
      bg: textureSunBg
    })
  }
}

const updateWeather = (weather: WeatherTypes) => {
  const data = weatherData[weather]
  curWeatherData = data

  raindrops.options = { ...raindrops.options, ...data }

  raindrops.clearDrops()

  TweenLite.fromTo(
    blend,
    1,
    { v: 0 },
    {
      v: 1,
      onUpdate: () => {
        generateTextures(data.fg, data.bg, blend.v)
        renderer.updateTextures()
      }
    }
  )
}

const flash = (
  baseBg: CanvasImageSource,
  baseFg: CanvasImageSource,
  flashBg: CanvasImageSource,
  flashFg: CanvasImageSource
) => {
  const flashValue = { v: 0 }

  function transitionFlash(to: number, t = 0.025) {
    return new Promise((resolve) => {
      TweenLite.to(flashValue, t, {
        v: to,
        ease: 'power1.out',
        onUpdate: () => {
          generateTextures(baseFg, baseBg)
          generateTextures(flashFg, flashBg, flashValue.v)
          renderer.updateTextures()
        },
        onComplete: () => {
          resolve(null)
        }
      })
    })
  }

  let lastFlash = transitionFlash(1)
  times(random(2, 7), () => {
    lastFlash = lastFlash.then(() => {
      return transitionFlash(random(0.1, 1))
    })
  })
  lastFlash = lastFlash
    .then(() => {
      return transitionFlash(1, 0.1)
    })
    .then(() => {
      transitionFlash(0, 0.25)
    })
}
const generateTextures = (
  fg: CanvasImageSource,
  bg: CanvasImageSource,
  alpha = 1
) => {
  if (!textureFgCtx || !textureBgCtx) return
  textureFgCtx.globalAlpha = alpha
  textureFgCtx.drawImage(fg, 0, 0, textureFgSize.width, textureFgSize.height)

  textureBgCtx.globalAlpha = alpha
  textureBgCtx.drawImage(bg, 0, 0, textureBgSize.width, textureBgSize.height)
}

export { initializer, updateWeather }
