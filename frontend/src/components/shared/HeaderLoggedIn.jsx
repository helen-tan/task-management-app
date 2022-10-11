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
    <div>
        <Link to='/users'>
            User Management
        </Link>
        <button onClick={handleLogout} className="btn btn-sm">
            Logout
        </button>
    </div>
  )
}

export default HeaderLoggedIn