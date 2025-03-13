import Home from './pages/Home';
import { Routes, Route, Navigate } from 'react-router';
import './App.css'
import Login from './pages/Login';
import Profile from './pages/Profile';
import Setting from './pages/Setting';
import SignUp from './pages/Signup';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const {theme}= useThemeStore(); 
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }
  return (
    <>
      <div className='' data-theme={theme}>
        <Navbar />
        <Routes>
          <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={!authUser ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/setting" element={!authUser ? <Setting /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/login" />} />

        </Routes>
        <Toaster />
      </div>
    </>
  )
}

export default App
