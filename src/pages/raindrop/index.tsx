import { useEffect, useRef } from 'react'
import loadImages from './ImageLoader'
import Raindrops from './Raindrops'
import RainRenderer from './RainRenderer'
import createCanvas from './createCanvas'
import TweenLite from 'gsap'

const textureBgSize = {
  width: 384,
  height: 256
}
const textureFgSize = {
  width: 96,
  height: 64
}

const parallax = { x: 0, y: 0 }

function RainDrop() {
  const mountRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = mountRef.current

    if (!canvas) {
      return
    }

    loadImages([
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
    ]).then((images) => {
      const textureRainFg = images.textureRainFg.img
      const textureRainBg = images.textureRainBg.img

      const textureFalloutFg = images.textureFalloutFg.img
      const textureFalloutBg = images.textureFalloutBg.img

      const textureStormLightningFg = images.textureStormLightningFg.img
      const textureStormLightningBg = images.textureStormLightningBg.img

      const textureSunFg = images.textureSunFg.img
      const textureSunBg = images.textureSunBg.img

      const textureDrizzleFg = images.textureDrizzleFg.img
      const textureDrizzleBg = images.textureDrizzleBg.img

      const dropColor = images.dropColor.img
      const dropAlpha = images.dropAlpha.img

      const dpi = window.devicePixelRatio
      const width = window.innerWidth
      const height = window.innerHeight
      canvas.width = width * dpi
      canvas.height = height * dpi
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'

      const raindrops = new Raindrops(
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

      const textureFg = createCanvas(textureFgSize.width, textureFgSize.height)
      const textureFgCtx = textureFg.getContext('2d')
      const textureBg = createCanvas(textureBgSize.width, textureBgSize.height)
      const textureBgCtx = textureBg.getContext('2d')

      const generateTextures = (
        fg: CanvasImageSource,
        bg: CanvasImageSource,
        alpha = 1
      ) => {
        if (!textureFgCtx || !textureBgCtx) return
        textureFgCtx.globalAlpha = alpha
        textureFgCtx.drawImage(
          fg,
          0,
          0,
          textureFgSize.width,
          textureFgSize.height
        )

        textureBgCtx.globalAlpha = alpha
        textureBgCtx.drawImage(
          bg,
          0,
          0,
          textureBgSize.width,
          textureBgSize.height
        )
      }

      generateTextures(textureRainFg, textureRainBg)

      const renderer = new RainRenderer(
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

      const setupParallax = () => {
        document.addEventListener('mousemove', (event) => {
          const x = event.pageX
          const y = event.pageY

          TweenLite.to(parallax, 1, {
            x: ((x / canvas.width) * 2) - 1,
            y: ((y / canvas.height) * 2) - 1,
            ease: 'power1.out',
            onUpdate: () => {
              renderer.parallaxX = parallax.x
              renderer.parallaxY = parallax.y
            }
          })
        })
      }
      const setupEvents = () => {
        setupParallax()
      }

      setupEvents()
    })
  }, [])
  return (
    <div
      className="h-full w-full overflow-hidden bg-cover bg-[center_top] bg-no-repeat"
      style={{ backgroundImage: `url(assets/raindrop/city.jpg)` }}
    >
      <canvas ref={mountRef} />
    </div>
  )
}

export default RainDrop
