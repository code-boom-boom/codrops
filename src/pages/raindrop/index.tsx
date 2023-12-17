import { useEffect, useRef } from 'react'
import initializer from './Initializer'

function RainDrop() {
  const mountRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = mountRef.current

    if (!canvas) {
      return
    }

    initializer(canvas)
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
