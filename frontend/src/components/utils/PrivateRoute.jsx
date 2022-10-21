import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
  const loggedIn = sessionStorage.getItem('token') ? true: false

  return loggedIn ? <Outlet /> : <Navigate to='/' />
}

export default PrivateRoute