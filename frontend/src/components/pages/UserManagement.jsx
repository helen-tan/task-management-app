import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import Page from '../utils/Page'
import BackButton from '../utils/BackButton'

function UserManagement() {
  const [isAdmin, setIsAdmin] = useState()

  const navigate = useNavigate()

  // Send request to check if the user is in the group "admin"
  async function checkIfAdmin() {
    const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
    const config = {
      headers: {
        Authorization: bearer_token
      }
    }
    try {
      const response = await Axios.post(`http://localhost:5000/api/groups/checkGroup`, {
        username: sessionStorage.getItem("username"),
        group_name: "admin"
      }, config)

      if (response.data) {
        //console.log(response.data.inGroup)
        response.data.inGroup ? setIsAdmin(true) : setIsAdmin(false)
      }
    } catch (err) {
      console.log("There was a problem")
      navigate("/")
    }
  }


  useEffect(() => {
    // Prevent non-admin users from accessing. Redirect to dashboard
    //if (sessionStorage.getItem("admin") === "false") navigate('/dashboard') // CANNOT STORE admin status in sessionStorage
   
    checkIfAdmin()

    // Prevent non-admin users from accessing. Redirect to dashboard
    if (isAdmin === false) navigate('/dashboard')
  }, [navigate])

  return (
    <Page title="User Management">
      <div className="flex justify-start mb-5 ml-5">
        <BackButton url='/dashboard' />
      </div>

      <h1 className='text-3xl mb-10 '><strong>User Management</strong></h1>

      <h2 className='text-2xl text-start ml-5'><strong>Create a New User</strong></h2>
    </Page>
  )
}

export default UserManagement