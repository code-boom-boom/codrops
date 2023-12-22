import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RainDrop from './pages/raindrop'
import LionPage from './pages/lion'

function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">
      <BrowserRouter>
        <Routes>
          <Route path="/rain-drop" element={<RainDrop />} />
          <Route path="/lion" element={<LionPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
