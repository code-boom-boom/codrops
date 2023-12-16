import { useEffect, useRef } from 'react'

function RainDrop() {
  const mountRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = mountRef.current

    if (!canvas) {
      return
    }

    const dpi = window.devicePixelRatio
    const width = window.innerWidth
    const height = window.innerHeight
    canvas.width = width * dpi
    canvas.height = height * dpi
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
  }, [])
  return (
    <div className="w-full h-full bg-cover overflow-hidden bg-no-repeat bg-[center_top]"
         style={{ backgroundImage: `url(assets/raindrop/city.jpg)` }}>
      <canvas ref={mountRef} />
    </div>
  )
}

export default RainDrop
