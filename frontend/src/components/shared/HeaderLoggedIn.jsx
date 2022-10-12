import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'

function HeaderLoggedIn(props) {
    const [isAdmin, setIsAdmin] = useState()

    useEffect(() => {
        setIsAdmin(sessionStorage.getItem("admin"))
    }, [])

    const handleLogout = () => {
        props.setLoggedIn(false)
        // Clear out logged in user's details from local storage
        sessionStorage.clear()
    }

  return (
    <div className="w-4/12 flex justify-evenly items-center">

        {(isAdmin === "true") && (
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