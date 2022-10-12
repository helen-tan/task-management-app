import React from 'react'
import { Link } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'

function HeaderLoggedIn(props) {
    const handleLogout = () => {
        props.setLoggedIn(false)
        // Clear out logged in user's details from local storage
        sessionStorage.clear()
    }

  return (
    <div className="w-4/12 flex justify-evenly items-center">

        {(props.isAdmin === "true") && (
        <Link to='/usermanagement'>
            User Management
        </Link>)}

        <p>
            <Link to='/profile'>
                <strong>Hi, {sessionStorage.getItem("username")}</strong>
            </Link>
        </p>
        <button onClick={handleLogout} className="btn btn-sm gap-2">
            <FaSignOutAlt/> Logout
        </button>
    </div>
  )
}

export default HeaderLoggedIn