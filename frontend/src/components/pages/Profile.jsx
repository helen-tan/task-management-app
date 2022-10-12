import Page from "../utils/Page"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import BackButton from "../utils/BackButton"
import { BsPencilSquare } from "react-icons/bs"
import Axios from "axios"

function Profile() {
    const [profileData, setProfileData] = useState({
        username: "...",
        email: "...",
        groups: ["..."]
    })

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

                setProfileData({
                    username: response.data.data[0].username,
                    email: response.data.data[0].email,
                    groups: response.data.data[0].groupz
                })
            } catch (err) {
                console.log("There was a problem")
            }
        }
        fetchUserData()
    }, [])

    return (
        <Page title='Profile'>
            <div className="flex justify-start mb-5 ml-5">
                <BackButton url='/dashboard' />
            </div>

            <div className="flex flex-col justify-center items-center m-5">
                <div className="w-3/4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-4xl text-left p-4"><strong>{profileData.username}</strong></h2>
                        <button  className="btn btn-sm gap-2">
                            <BsPencilSquare/> Edit
                        </button>
                    </div>
                    <hr />
                    <div className="text-left my-4">
                        <span className="font-semibold">Email:</span> {profileData.email}
                    </div>
                    <div className="text-left my-4">
                        <span className="font-semibold">Groups:</span> {profileData.groups}
                    </div>
                </div>
            </div>
        </Page>
    )
}

export default Profile