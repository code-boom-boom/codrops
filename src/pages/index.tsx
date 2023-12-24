import { ReactElement } from 'react'
import routes from '../routes'
import { Link } from 'react-router-dom'

function HomePage(): ReactElement {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        {routes.map((route, index) => (
          <Link key={`item-${index}`} to={route.path}>
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default HomePage
