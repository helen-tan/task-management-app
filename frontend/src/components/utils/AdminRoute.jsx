import { Navigate, Outlet } from 'react-router-dom'
import { useState } from 'react'

const AdminRoute = () => {
    const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem('admin')) 

    return (isAdmin === "true") ? <Outlet /> : <Navigate to='/' /> 
    {/*navigate to 404 page in future? */}
}

export default AdminRoute