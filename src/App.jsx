import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import { useCircuitRipple } from './hooks/useSemiconductorEffects'

// ── Eagerly loaded (above the fold, needed instantly) ──
import Landing from './pages/Landing'
import Login from './pages/Login'

// ── Lazily loaded (not visited on first load) ──
const Register = lazy(() => import('./pages/Register'))
const Events = lazy(() => import('./pages/Events'))
const Schedule = lazy(() => import('./pages/Schedule'))
const Speakers = lazy(() => import('./pages/Speakers'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Committee = lazy(() => import('./pages/Committee'))
const ParticipantDashboard = lazy(() => import('./pages/ParticipantDashboard'))
const CoordinatorDashboard = lazy(() => import('./pages/CoordinatorDashboard'))
const FacultyDashboard = lazy(() => import('./pages/FacultyDashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Minimal fallback — no spinner, just empty dark screen so there's no flash
const PageShell = () => (
  <div style={{ minHeight: '100vh', background: '#030706' }} />
)

function App() {
  // Enable semiconductor-themed click ripples
  useCircuitRipple();

  return (
    <AuthProvider>
      <ScrollToTop />
      <Suspense fallback={<PageShell />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/speakers" element={<Speakers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/committee" element={<Committee />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard/participant"
            element={
              <ProtectedRoute allowedRoles={['participant']}>
                <ParticipantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/coordinator"
            element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <CoordinatorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/faculty"
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default App
