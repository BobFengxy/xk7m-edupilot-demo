import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Chat from './pages/Chat'
import Lesson from './pages/Lesson'
import Works from './pages/Works'
import Knowledge from './pages/Knowledge'
import Classroom from './pages/Classroom'
import Homework from './pages/Homework'
import Agents from './pages/Agents'
import Cloud from './pages/Cloud'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/works" element={<Works />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/homework" element={<Homework />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/cloud" element={<Cloud />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
