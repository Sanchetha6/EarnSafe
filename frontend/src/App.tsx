import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Claims from './pages/Claims'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Onboarding />} />
        <Route path="/dashboard/:workerId" element={<Dashboard />} />
        <Route path="/claims/:workerId" element={<Claims />} />
      </Routes>
    </BrowserRouter>
  )
}