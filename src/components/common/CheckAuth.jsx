import React from 'react'
import { useLocation, useNavigate } from 'react-router'

function CheckAuth({ isAuthenticated, user, children }) {

  const location = useLocation()
  const navigate = useNavigate()

  if (!isAuthenticated && !(location.pathname.includes('/login') || location.pathname.includes('/register'))) {
    navigate('/login')
  }
  if (isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/register'))) {
    if (user?.role == 'admin') {
      navigate('/admin/dashboard')
    }
    else {
      navigate('/shop/home')
    }
  }

  if (isAuthenticated && user?.role != 'admin' && location.pathname.includes('admin')) {
    navigate('unauth-page')
  }
  return (
    <div>
      {children}
    </div>
  )
}

export default CheckAuth