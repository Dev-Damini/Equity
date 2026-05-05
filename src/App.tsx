import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Loading from './pages/Loading'
import Success from './pages/Success'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/success" element={<Success />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
