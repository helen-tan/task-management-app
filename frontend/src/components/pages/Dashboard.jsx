import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Page from '../utils/Page'
import AppList from '../shared/AppList'
import Spinner from "../utils/Spinner"
import Axios from "axios"

function Dashboard() {
  const [loggedInUser, setLoggedInUser] = useState()
  const [loggedInUserGroups, setLoggedInUserGroups] = useState([])

  const [loadingAuth, setLoadingAuth] = useState(true)
  const [loadingGetUserGroups, setLoadingGetUserGroups] = useState(true)

  const navigate = useNavigate();

  const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
  const config = {
    headers: {
      Authorization: bearer_token
    }
  }

  // Send request to get identity of logged in user
  const authenticate = async () => {
    try {
      const response = await Axios.get(`http://localhost:5000/api/users/authuser`, config)
      if (response.data) {
        setLoggedInUser(response.data.loggedInUser)
        setLoadingAuth(false)

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

    async function getUserGroups() {
      try {
        const response = await Axios.get(`http://localhost:5000/api/groups/${loggedInUser}`, config)
        if (response.data) {
          console.log(response.data.data[0].groupz)
          setLoggedInUserGroups(response.data.data[0].groupz)
          setLoadingGetUserGroups(false)
        }
      } catch (err) {
        console.log("There was a problem")
        console.log(err)
      }
    }

    getUserGroups()
  }, [loggedInUser])

  if (loadingAuth && loadingGetUserGroups) {
    return <Spinner /> 
  } else {
    return (
      <Page title="Dashboard">
        <div>
          <h1 className="text-2xl">Welcome <strong>{loggedInUser}</strong></h1>
        </div>
        <AppList loggedInUserGroups={loggedInUserGroups}/>
      </Page>
    )
  }
}

export default Dashboard