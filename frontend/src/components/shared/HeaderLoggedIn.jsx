import React from 'react'
import { Link } from 'react-router-dom'

function HeaderLoggedIn(props) {
  return (
    <div>
        <Link to='/users'>
            User Management
        </Link>
        <button onClick={() => props.setLoggedIn(false)} className="btn btn-sm">
            Logout
        </button>
    </div>
  )
}

export default HeaderLoggedIn