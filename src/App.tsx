import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home'
import TokenMap from '@/pages/TokenMap'
import Lore from '@/pages/Lore'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/token/:address" element={<TokenMap />} />
        <Route path="/lore" element={<Lore />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
