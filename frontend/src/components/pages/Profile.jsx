import Page from "../utils/Page"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Modal from 'react-modal';
import BackButton from "../utils/BackButton"
import { BsPencilSquare } from "react-icons/bs"

import Axios from "axios"

function Profile() {
    // const [profileData, setProfileData] = useState({
    //     username: "...",
    //     email: "...",
    //     groups: ["..."]
    // })

    const [username, setUsername] = useState("...")
    const [email, setEmail] = useState("...")
    const [groups, setGroups] = useState(["..."])
    const [password1, setPassword1] = useState("...")
    const [password2, setPassword2] = useState("...")
    const [modalIsOpen, setModalIsOpen] = useState(false)

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

                setUsername(response.data.data[0].username)
                setEmail(response.data.data[0].email)
                setGroups(response.data.data[0].groupz)

                // setProfileData({
                //     username: response.data.data[0].username,
                //     email: response.data.data[0].email,
                //     groups: response.data.data[0].groupz
                // })
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
    const handleUpdate = (e) => {
        e.preventDefault()
        console.log('submit')
        console.log(email)
        console.log(password1)
        console.log(password2)
        // Validation - password 1 & password2 must match

        closeModal()
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
                <h2>Edit Details</h2>
                <button onClick={closeModal} className="btn btn-sm">X</button>
                
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label htmlFor="email-edit">Email:</label>
                        <input 
                            className="form-control" 
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            placeholder="Enter your email here" 
                            value={email}
                            id="email-edit"
                        ></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password1-edit">Password:</label>
                        <input 
                            className="form-control" 
                            onChange={(e) => setPassword1(e.target.value)}
                            type="text"
                            placeholder="Enter new password" 
                            id="password1-edit"
                        ></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password2-edit">Confirm Password:</label>
                        <input 
                            className="form-control" 
                            onChange={(e) => setPassword2(e.target.value)}
                            type="text"
                            placeholder="Enter new password again" 
                            id="password2-edit"
                        ></input>
                    </div>
                    <button className="btn" type="submit">Submit</button>
                </form>

            </Modal>
        </Page>
    )
}

export default Profile