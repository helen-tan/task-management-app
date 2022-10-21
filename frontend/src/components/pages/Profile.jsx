import Page from "../utils/Page"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Modal from 'react-modal';
import BackButton from "../utils/BackButton"
import { BsPencilSquare } from "react-icons/bs"
import { toast } from 'react-toastify'

import Axios from "axios"

function Profile() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [groups, setGroups] = useState([""])

    const [emailInput, setEmailInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const params = useParams() // Get URL dynamic params
    const navigate = useNavigate()

    const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
    const config = {
        headers: {
            Authorization: bearer_token
        }
    }

    // Send request to check if the user is the logged in user
    async function authenticate() {
        try {
            const response = await Axios.get(`http://localhost:5000/api/users/authuser`, config)
            if (response.data) {
                const username = params.username // user of interest
                const loggedInUser = response.data.loggedInUser // logged in user
           
                console.log(response.data)
                //console.log(`logged in user is ${loggedInUser}`)
                //console.log(`user of interest is ${username}`)

                // Check if logged in user = username in sessionStorage - If not redirect to dashboard
                if (username !== loggedInUser) {
                    navigate("/dashboard")
                }
            }
        } catch (err) {
            console.log("There was a problem")
            console.log(err)
            //navigate("/dashboard")
        }
    }

    useEffect(() => {
        // Prevent users who are not the owner from accessing this page
        authenticate()

        // Fetch current user's data
        async function fetchUserData() {
            try {
                const response = await Axios.get(`http://localhost:5000/api/users/${params.username}`, config)
                //console.log(response.data)

                setUsername(response.data.data[0].username)
                setEmail(response.data.data[0].email)
                setGroups(response.data.data[0].groupz)

                setEmailInput(response.data.data[0].email)

            } catch (err) {
                console.log("There was a problem")
            }
        }
        fetchUserData()
    }, [])

    // Modal: Update user details (email, groups)
    Modal.setAppElement('#root');

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%'
        },
    };

    const openModal = () => setModalIsOpen(true)
    const closeModal = () => setModalIsOpen(false)

    // Update user details
    const handleUpdate = async (e) => {
        e.preventDefault()

        const newUserData = {
            email: emailInput,
            password: passwordInput,
        }

        // Send put request to update user details
        try {
            const response = await Axios.put(`http://localhost:5000/api/users/${params.username}/updateProfile`, newUserData, config)
            if (response) {
                console.log(response.data)
                if (response.data.success === true) {
                    toast.success(response.data.message)
                    setEmail(response.data.data.email)
                    closeModal()
                } else {
                    toast.warning(response.data.message)
                }
            }
        } catch (err) {
            console.log(err)
            toast.error("There was a problem")
        }

    }

    return (
        <Page title='Profile'>
            <div className="flex justify-start mb-5 ml-5">
                <BackButton url='/dashboard' />
            </div>

            <div className="flex flex-col justify-center items-center m-5">
                <div className="w-3/4">
                    <div className="flex justify-between items-center">
                        {/* Username */}
                        <h2 className="text-4xl text-left p-4"><strong>{username}</strong></h2>
                        {/* Edit button */}
                        <button onClick={openModal} className="btn btn-sm gap-2">
                            <BsPencilSquare /> Edit
                        </button>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    {/* User details */}
                    <div className="text-left my-4 flex gap-2">
                        <h3 className="font-semibold">Email:</h3>
                        <p>{email}</p>
                    </div>
                    <div className="text-left my-4 flex gap-2">
                        <h3 className="font-semibold">Groups:</h3>

                        {groups.map((group) => (
                            <div className="badge badge-primary" key={group}>{group}</div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Edit Details"
            >
                <div className="flex justify-between mb-5">
                    <h2 className="font-bold text-xl">Edit Details</h2>
                    <button onClick={closeModal}><strong>X</strong></button>
                </div>

                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label htmlFor="profile-email-edit" className="font-semibold">Email:</label>
                        <input
                            className="form-control"
                            onChange={(e) => setEmailInput(e.target.value)}
                            type="text"
                            placeholder="Enter your email here"
                            value={emailInput}
                            id="profile-email-edit"
                        ></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="profile-password-edit" className="font-semibold">New Password:</label>
                        <input
                            className="form-control"
                            onChange={(e) => setPasswordInput(e.target.value)}
                            type="password"
                            placeholder="Enter new password"
                            value={passwordInput}
                            id="profile-password-edit"
                            autoComplete="off"
                        ></input>
                    </div>

                    <button className="btn btn-block mt-3" type="submit">Submit</button>
                </form>

            </Modal>
        </Page>
    )
}

export default Profile