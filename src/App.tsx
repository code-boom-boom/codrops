import { BrowserRouter, Route, Routes } from 'react-router-dom'
import routes from './routes'
import HomePage from './pages'
import LionPage from './pages/lion'

function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {routes.map((route) => (
            <Route
              key={`path-${route.path}`}
              path={route.path}
              element={<route.pageComponent />}
            />
          ))}
          <Route path="/lion" element={<LionPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
