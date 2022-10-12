import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Page from '../utils/Page'
import BackButton from '../utils/BackButton'

function UserManagement() {
  const navigate = useNavigate()

  useEffect(() => {
    // Prevent non-admin users from accessing. Redirect to dashboard
    if (sessionStorage.getItem("admin") === "false") navigate('/dashboard')
  }, [navigate])

  return (
    <Page title="User Management">
        <div className="flex justify-start mb-5 ml-5">
            <BackButton url='/'/>
        </div>
        
        <h1 className='text-3xl mb-10 '><strong>User Management</strong></h1>

        <h2 className='text-2xl text-start ml-5'><strong>Create a New User</strong></h2>
    </Page>
  )
}

export default UserManagement