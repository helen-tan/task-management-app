import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header>
      <div className='flex justify-between items-center py-5 mb-14 border-b-2 border-slate-200'>
        <Link to='/' className='px-5'>TMS System</Link>
      </div>
    </header>
  )
}

export default Header