import React from 'react'
import { Link } from 'react-router-dom'
import HeaderLoggedIn from './HeaderLoggedIn'

function Header(props) {

  return (
    <header>
      <div className='flex justify-between items-center py-5 mb-14 border-b-2 border-slate-200'>
        <h4>
        <Link to='/dashboard' className='px-5'>TMS System</Link>
        </h4>
        {(props.loggedIn) && <HeaderLoggedIn setLoggedIn={props.setLoggedIn} /> }
      </div>
    </header>
  )
}

export default Header