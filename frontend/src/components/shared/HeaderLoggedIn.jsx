import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios'
import { FaSignOutAlt } from 'react-icons/fa'

function HeaderLoggedIn(props) {
    const [isAdmin, setIsAdmin] = useState()
    const [loggedInUser, setLoggedInUser] = useState()

    // Send request to check if the user is in the group "admin"
    const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
    const config = {
        headers: {
            Authorization: bearer_token
        }
    }

    async function authenticate() {
        try {
          const response = await Axios.get(`http://localhost:5000/api/users/authuser`, config)
    
          if (response.data) {
            const admin = response.data.isAdmin                   // admin status returned from api
            // console.log(`in headerloggedin props.loggedinuser is ${props.loggedInUser}`)
            setLoggedInUser(response.data.loggedInUser)           // logged in user returned from api 
            //const loggedInUser = response.data.loggedInUser       
            // const username = props.loggedInUser                      // Get logged in user from global state/ props (DOESN'T PERSIST WTF)
            
            // Check if user is an admin 
            admin ? setIsAdmin(true) :setIsAdmin(false)
          }
        } catch (err) {
          console.log("There was a problem")
        }
      }

    // async function checkIfAdmin() {
    //     console.log(`in headerloggedin props.loggedinuser is ${props.loggedInUser}`)
    //     try {
    //         const response = await Axios.post(`http://localhost:5000/api/groups/checkGroup`, {
    //             username: props.loggedInUser,
    //             group_name: "admin"
    //         }, config)
    //         if (response.data) {
    //             // console.log(response.data.inGroup)
    //             response.data.inGroup ? setIsAdmin(true) : setIsAdmin(false)
    //         }
    //     } catch (err) {
    //         console.log(`in headerloggedin props.loggedinuser is ${props.loggedInUser}`)
    //         console.log("There was a problem")
    //     }
    // }

    useEffect(() => {
        // checkIfAdmin()
        authenticate()
    }, [])

    const handleLogout = () => {
        props.setLoggedIn(false)
        // Clear out logged in user's details from local storage
        sessionStorage.clear()
    }

    return (
        <div className="w-4/12 flex justify-evenly items-center gap-2">

            {(isAdmin === true) && (
                <Link to='/usermanagement'>
                    User Management
                </Link>)}

            <Link to={`/profile/${loggedInUser}`}>
                <strong>{loggedInUser}</strong>
            </Link>

            <button onClick={handleLogout} className="btn btn-sm gap-2">
                <FaSignOutAlt /> Logout
            </button>
        </div>
    )
}

export default HeaderLoggedIn