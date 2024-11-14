import './App.css'
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        {/* Redirect root path to home if needed */}
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
