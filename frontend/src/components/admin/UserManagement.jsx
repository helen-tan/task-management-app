import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Axios from 'axios'
import Page from '../utils/Page'
import BackButton from '../utils/BackButton'
import Modal from 'react-modal'
import CreateUser from './CreateUser'
import UserItem from './UserItem'
import EditUserItem from './EditUserItem'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [userToEdit, setUserToEdit] = useState(null) // user is not editing any row by default

  const [editFormEmail, setEditFormEmail] = useState("")
  const [editFormGroups, setEditFormGroups] = useState([])
  const [editFormStatus, setEditFormStatus] = useState("")
  const [editFormPassword, setEditFormPassword] = useState("")

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [createGroupInput, setCreateGroupInput] = useState("")

  const [count, setCount] = useState(0) // For inducing re-render of CreateUser form whenever a new group is created 

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
  }, [users]) // Re-render this component whenever users state updates

  // Handle edit row
  const handleEditClick = (e, user) => {
    e.preventDefault()
    setUserToEdit(user.username)

    // format groups for react-select Select component (to see initial value in input)
    // in format: [{ value: "xxx", label: "xxx" }, { value: "yyy", label: "yyy" }] 
    let initialGroups = []

    user.groupz.forEach((group) => {
      initialGroups.push({ value: `${group}`, label: `${group}` })
    })

    setEditFormEmail(user.email)
    setEditFormGroups(initialGroups)
    setEditFormStatus(user.is_active)
    setEditFormPassword(user.password)
  }

  // Handle edit row changes (Outdated: Used previously when all the form data was stored in 1 state )
  // const handleEditFormChange = (e) => {
  //   e.preventDefault()

  //   const fieldName = e.target.getAttribute("name")
  //   const fieldValue = e.target.value

  //   const newFormData = { ...editFormData }
  //   newFormData[fieldName] = fieldValue

  //   setEditFormData(newFormData)
  //   console.log(editFormData)
  // }

  // Handle Save btn click
  const handleEditFormSubmit = async (e) => {
    e.preventDefault()

    // format groups from  [{ value: "xxx", label: "xxx" }, { value: "yyy", label: "yyy" }] format
    // back to ["xxx", "yyy"] format
    let groupsInputArr = []

    // Format editFormGroups from [{value: 'xxx', label: 'xxx'}, {value: 'yyy', label: 'yyy'}] to ["xxx", "yyy"] 
    editFormGroups.forEach((item) => {
      groupsInputArr.push(item.value)
    })

    const editedUser = {
      email: editFormEmail,
      groupz: groupsInputArr,
      is_active: editFormStatus,
      password: editFormPassword
    }

    console.log(editedUser)

    // Send put request to update user details
    try {
      const response = await Axios.put(`http://localhost:5000/api/users/${userToEdit}/updateUser`, editedUser, config)
      if (response) {
        console.log(response.data)
        if (response.data.success === true) {
          toast.success(response.data.message)

        } else {
          toast.warning(response.data.message)
        }
      }
    } catch (err) {
      console.log(err)
      console.log(err.response.data)
      toast.error("There was a problem")
    }

    // Hide editable row
    setUserToEdit(null)
  }

  // Handle Cencel btn click
  const handleCancelClick = (e) => {
    setUserToEdit(null)
  }

  // Modal: Create New Group 
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

  const handleGroupCreate = async (e) => {
    e.preventDefault()

    // Send post request to create a new group
    try {
      const response = await Axios.post(`http://localhost:5000/api/groups`, { group_name: createGroupInput }, config)
      if (response) {
        console.log(response.data)
        if (response.data.success === true) {
          toast.success(response.data.message)
          // increment count state (to induce re render of CreateUser form to include new group instatnly in dropdown)
          setCount(prevState => prevState + 1)
          // clear user input
          document.getElementById("create-group").value = ""

        } else {
          toast.warning(response.data.message)
          // clear user input
          document.getElementById("create-group").value = ""
        }
      }
    } catch (err) {
      console.log(err)
      if (err.response.data.message === "ER_DUP_ENTRY") {
        toast.warning("This group already exists")
      } else {
        toast.error("There was a problem")
      }
      // clear user input
      document.getElementById("create-group").value = ""
    }
  }

  return (
    <Page title="User Management">
      <div className="flex justify-start mb-5 ml-5">
        <BackButton url='/dashboard' />
      </div>

      <h1 className='text-3xl mb-10 '><strong>User Management</strong></h1>

      <div className='flex justify-between items-center'>
        <h2 className='text-2xl text-start font-semibold mx-5 my-5'>Create a New User</h2>
        {/* Create group button */}
        <button onClick={openModal} className="btn btn-sm mr-10">
          Create new group
        </button>
      </div>

      {/* Create new user form */}
      <CreateUser count={count} />

      {/* List of existing users */}
      <h2 className='text-2xl text-start font-semibold mx-5 my-5'>Users</h2>

      <div className="overflow-x-auto mx-10">
        <form onSubmit={handleEditFormSubmit}>
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Groups</th>
                <th>Status</th>
                <th></th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <>
                  {userToEdit === user.username
                    ? <EditUserItem
                      index={index}
                      user={user}
                      handleCancelClick={handleCancelClick}        // fn to handle Cancel btn click
                      editFormEmail={editFormEmail}
                      editFormGroups={editFormGroups}
                      editFormStatus={editFormStatus}
                      editFormPassword={editFormPassword}
                      setEditFormEmail={setEditFormEmail}          // To handle row changes
                      setEditFormGroups={setEditFormGroups}
                      setEditFormStatus={setEditFormStatus}
                      setEditFormPassword={setEditFormPassword}
                    />
                    : <UserItem
                      index={index}
                      user={user}
                      handleEditClick={handleEditClick} // fn to handle Edit btn click
                    />
                  }
                </>
              ))}
            </tbody>
          </table>
        </form>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Create New Group"
      >
        <div className="flex justify-between mb-5">
          <h2 className="font-bold text-xl">Create new group</h2>
          <button onClick={closeModal}><strong>X</strong></button>
        </div>

        <form onSubmit={handleGroupCreate}>
          <div className="form-group">
            <label htmlFor="create-group" className="font-semibold">Group name:</label>
            <input
              className="form-control"
              onChange={(e) => setCreateGroupInput(e.target.value)}
              type="text"
              placeholder="Enter a new group name here"
              value={createGroupInput}
              id="create-group"
            ></input>
          </div>

          <button className="btn btn-sm btn-block mt-3" type="submit">Submit</button>
        </form>

      </Modal>
    </Page>
  )
}

export default UserManagement