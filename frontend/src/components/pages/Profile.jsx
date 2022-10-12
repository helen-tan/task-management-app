import Page from "../utils/Page"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import Axios from "axios"

function Profile() {
    const params = useParams() // Get URL dynamic params

    useEffect(() => {
        async function fetchUserData() {
            const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
            const config = {
                headers: {
                  Authorization: bearer_token
                }
              }
            try {
                const response = await Axios.get(`http://localhost:5000/api/users/${params.username}`, config)
                console.log(response.data)
            } catch(err) {
                console.log("There was a problem")
            }
        }
        fetchUserData()
    }, [])

  return (
    <Page title='Profile'>
        <h2>Profile</h2>

    </Page>
  )
}

export default Profile