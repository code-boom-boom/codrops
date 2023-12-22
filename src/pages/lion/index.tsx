import { ReactElement, useEffect, useRef } from 'react'
import initialize from './initializer'

function LionPage(): ReactElement {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current

    if (!container) {
      return
    }

    initialize(container)
  }, [])
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute h-screen w-screen overflow-hidden bg-[#ebe5e7]"
        ref={mountRef}
      />
    </div>
  )
}

export default LionPage
