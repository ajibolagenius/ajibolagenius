import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Approach from './pages/Approach'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/approach" element={<Approach />} />
    </Routes>
  )
}

export default App
