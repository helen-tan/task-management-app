import { Navigate, Outlet } from 'react-router-dom'

const AdminRoute = () => {
    const admin = localStorage.getItem('admin') 

    return (admin === "true") ? <Outlet /> : <Navigate to='/' /> 
    {/*navigate to 404 page in future? */}
}

export default AdminRoute