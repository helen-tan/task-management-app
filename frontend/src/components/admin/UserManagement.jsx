import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import Page from '../utils/Page'
import BackButton from '../utils/BackButton'

function UserManagement() {

  const navigate = useNavigate()

  // Send request to check if the user is in the group "admin" + check username
  async function authenticate() {
    const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
    const config = {
      headers: {
        Authorization: bearer_token
      }
    }
    try {
      const response = await Axios.get(`http://localhost:5000/api/users/authuser`, config)

      if (response.data) {
        console.log(response.data)
        const username = sessionStorage.getItem("username")
        const admin = response.data.isAdmin
        const loggedInUser = response.data.loggedInUser

        console.log(username === loggedInUser)

        // Check if logged in user = username in sessionStorage - If not log user out
        if (username !== loggedInUser) {
          sessionStorage.clear()
          navigate("/") 
        }

        // Check if user is an admin - Prevent non-admin users from accessing. Redirect to dashboard
        if (!admin) {
          navigate("/dashboard") 
        }
      }
    } catch (err) {
      console.log("There was a problem")
      navigate("/")
    }
  }


  useEffect(() => {
    authenticate()
    
  }, [authenticate])

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