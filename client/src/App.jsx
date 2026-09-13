import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import MemberDetail from './pages/MemberDetail'
import DataEntry from './pages/DataEntry'
import Compare from './pages/Compare'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Rsvp from './pages/Rsvp'
import CheckIn from './pages/CheckIn'
import Events from './pages/Events'
import AuditLog from './pages/AuditLog'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/members/:id" element={<MemberDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rsvp" element={<Rsvp />} />
        <Route path="/checkin/:token" element={<CheckIn />} />

        <Route element={<RequireAuth />}>
          <Route path="/data-entry" element={<DataEntry />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/events" element={<Events />} />
          <Route path="/audit-log" element={<AuditLog />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
