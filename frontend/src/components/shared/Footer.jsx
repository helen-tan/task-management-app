import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="text-center border-t-2 border-slate-200 text-slate-400 py-3">
      <p>
        <Link to="/" className="mx-1">Home</Link> |
        <Link to="/users" className="mx-1">User Management</Link>
      </p>
      <p className="m-0">Copyright &copy; 2020 <Link to="/" className="text-slate-400">Task Management System</Link>. All rights reserved.</p>
    </footer>
  )
}

export default Footer