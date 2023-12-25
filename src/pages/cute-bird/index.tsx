import { ReactElement, useEffect, useRef } from 'react'
import { initializer, unmount } from './initializer'

function CuteBirdPage(): ReactElement {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current

    if (!container) {
      return
    }

    initializer(container)

    return () => {
      unmount()
    }
  }, [])
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute h-screen w-screen overflow-hidden bg-[#e0dacd]"
        ref={mountRef}
      />
    </div>
  )
}

export default CuteBirdPage
