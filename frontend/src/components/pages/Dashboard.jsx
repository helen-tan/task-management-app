import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Page from '../utils/Page'
import AppList from '../shared/AppList'
import Axios from "axios"

function Dashboard() {
  const [loggedInUser, setLoggedInUser] = useState()

  const navigate = useNavigate();

  const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
  const config = {
    headers: {
      Authorization: bearer_token
    }
  }

  // Send request to get identity of logged in user
  async function authenticate() {
    try {
      const response = await Axios.get(`http://localhost:5000/api/users/authuser`, config)
      if (response.data) {
        setLoggedInUser(response.data.loggedInUser)

        console.log(response.data)
      }
    } catch (err) {
      console.log("There was a problem")
      console.log(err)
      navigate("/")
    }
  }

  useEffect(() => {
    authenticate()
  }, [])

  return (
    <Page title="Dashboard">
      <div>
        <h1 className="text-2xl">Welcome <strong>{loggedInUser}</strong></h1>

        <AppList />
      </div>
    </Page>
  )
}

export default Dashboard