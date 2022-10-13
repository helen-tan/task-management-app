import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios'
import { FaSignOutAlt } from 'react-icons/fa'

function HeaderLoggedIn(props) {
    const [isAdmin, setIsAdmin] = useState()

    useEffect(() => {
        //setIsAdmin(sessionStorage.getItem("admin")) // CANNOT DO THIS
        // Send request to check if the user is in the group "admin"
        const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
            const config = {
                headers: {
                    Authorization: bearer_token
                }
            }
        async function checkIfAdmin() {
            try {
                const response = await Axios.post(`http://localhost:5000/api/groups/checkGroup`, {
                    username: sessionStorage.getItem("username"),
                    group_name: "admin"
                }, config)
                if(response.data) {
                    // console.log(response.data.inGroup)
                    response.data.inGroup ? setIsAdmin(true) : setIsAdmin(false)
                }
            } catch (err) {
                console.log("There was a problem")
            }
        }
        checkIfAdmin()
    }, [])

    const handleLogout = () => {
        props.setLoggedIn(false)
        // Clear out logged in user's details from local storage
        sessionStorage.clear()
    }

  return (
    <div className="w-4/12 flex justify-evenly items-center">

        {(isAdmin === true) && (
        <Link to='/usermanagement'>
            User Management
        </Link>)}

        <Link to={`/profile/${sessionStorage.getItem("username")}`}>
            <strong>{sessionStorage.getItem("username")}</strong>
        </Link>
        
        <button onClick={handleLogout} className="btn btn-sm gap-2">
            <FaSignOutAlt/> Logout
        </button>
    </div>
  )
}

export default HeaderLoggedIn