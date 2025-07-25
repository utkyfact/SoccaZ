import React from 'react'
import { Route, Routes } from 'react-router'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import Matches from './pages/Matches'
import Contact from './pages/Contact'

import Profile from './pages/Profile'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import CookieSettings from './pages/CookieSettings'
import MatchDetail from './pages/MatchDetail'
import CookieBanner from './components/CookieBanner'
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/PrivateRoute';
import Admin from './pages/Admin'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!text-sm sm:!text-base !max-w-xs sm:!max-w-md !p-2 sm:!p-3 !mt-4 sm:!mt-6"
        bodyClassName="!text-xs sm:!text-sm"
        style={{ top: '1rem', right: '1rem' }}
      />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/match/:id" element={<MatchDetail />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<CookieSettings />} />

        <Route path="/admin" element={<PrivateRoute requireAdmin={true}><Admin /></PrivateRoute>} />
      </Routes>
      
      <CookieBanner />
    </>
  )
}

export default App
