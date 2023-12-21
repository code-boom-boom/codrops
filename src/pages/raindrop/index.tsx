import { useEffect, useRef, useState } from 'react'
import { initializer, updateWeather } from './Initializer'
import {
  IoRainyOutline,
  IoSunnyOutline,
  IoThunderstormOutline
} from 'react-icons/io5'
import classNames from 'classnames'
import { WeatherTypes } from './Types'
import { IconType } from 'react-icons'
import { BsCloudDrizzle } from 'react-icons/bs'
import { GiNuclear } from 'react-icons/gi'

interface weatherType {
  type: WeatherTypes
  icon: IconType
}

const weathers: Array<weatherType> = [
  {
    type: 'rain',
    icon: IoRainyOutline
  },
  {
    type: 'drizzle',
    icon: BsCloudDrizzle
  },
  {
    type: 'storm',
    icon: IoThunderstormOutline
  },
  {
    type: 'sunny',
    icon: IoSunnyOutline
  },
  {
    type: 'fallout',
    icon: GiNuclear
  }
]

function RainDrop() {
  const mountRef = useRef<HTMLCanvasElement>(null)
  const [weather, setWeather] = useState<WeatherTypes>('storm')
  const [initialized, setInitialized] = useState<boolean>(false)

  useEffect(() => {
    const canvas = mountRef.current

    if (!canvas) {
      return
    }

    initializer(canvas).then(() => {
      updateWeather(weather)
      setInitialized(true)
    })
  }, [])

  useEffect(() => {
    if (initialized) {
      updateWeather(weather)
    }
  }, [weather])
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-cover bg-[center_top] bg-no-repeat"
      style={{ backgroundImage: `url(assets/raindrop/city.jpg)` }}
    >
      <canvas ref={mountRef} />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-12">
        <span className="text-center text-7xl font-bold uppercase text-blue-950">
          Rain
        </span>
        <div className="flex items-center justify-center gap-8">
          {weathers.map((item) => (
            <div
              className={classNames({
                'cursor-pointer': item.type !== weather
              })}
              key={item.type}
              onClick={() => {
                setWeather(item.type)
              }}
            >
              {
                <item.icon
                  size={42}
                  color={item.type === weather ? 'white' : '#172554'}
                />
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RainDrop
