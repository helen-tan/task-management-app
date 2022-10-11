import React from 'react'
import { Link } from 'react-router-dom'

function HeaderLoggedIn(props) {
    const handleLogout = () => {
        props.setLoggedIn(false)
        // Clear out logged in user's details from local storage
        localStorage.removeItem("token")
        localStorage.removeItem("username")
    }

  return (
    <div className="w-4/12 flex justify-evenly items-center">
        <Link to='/users'>
            User Management
        </Link>
        <p><strong>Hi, {localStorage.getItem("username")}</strong></p>
        <button onClick={handleLogout} className="btn btn-sm">
            Logout
        </button>
    </div>
  )
}

export default HeaderLoggedIn