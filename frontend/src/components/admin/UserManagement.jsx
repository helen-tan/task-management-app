import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import Page from '../utils/Page'
import BackButton from '../utils/BackButton'
import UserItem from './UserItem'

function UserManagement() {
  const [users, setUsers] = useState([])

  const navigate = useNavigate()

  const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
  const config = {
    headers: {
      Authorization: bearer_token
    }
  }

  // Send request to check if the user is in the group "admin" + check username
  async function authenticate() {
    try {
      const response = await Axios.get(`http://localhost:5000/api/users/authuser`, config)

      if (response.data) {
        const username = sessionStorage.getItem("username")   // supposed logged in user saved in sessionStorage (not reliable)
        const admin = response.data.isAdmin                   // admin status returned from api
        const loggedInUser = response.data.loggedInUser       // logged in user returned from api (more reliable)

        // Check if logged in user = username in sessionStorage - If not log user out (someone was trying to hack from sessionStorage)
        if (username !== loggedInUser) {
          sessionStorage.clear()
          navigate("/")
        }

        // Check if user is an admin - Prevent non-admin users from accessing. Redirect to dashboard (Non-admin trying to access from URL)
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
    // Prevent non-admins from accessing this page
    authenticate()

    // Fetch all users
    async function fetchAllUsers() {
      try {
        const response = await Axios.get(`http://localhost:5000/api/users`, config)
        // console.log(response.data)
        // Set array of users into state
        setUsers(response.data.data)

      } catch (err) {
        console.log("There was a problem")
      }
    }
    fetchAllUsers()
  }, [])

  return (
    <Page title="User Management">
      <div className="flex justify-start mb-5 ml-5">
        <BackButton url='/dashboard' />
      </div>

      <h1 className='text-3xl mb-10 '><strong>User Management</strong></h1>

      <div className='flex justify-between items-center'>
        <h2 className='text-2xl text-start font-semibold mx-5 my-5'>Create a New User</h2>
        <button className="btn btn-sm">
          Create new group
        </button>
      </div>

      <h2 className='text-2xl text-start font-semibold mx-5 my-5'>Users</h2>

      <div className="overflow-x-auto mx-5">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Groups</th>
              <th>Status</th>
              <th>Password</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <UserItem key={user.username} index={index} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  )
}

export default UserManagement