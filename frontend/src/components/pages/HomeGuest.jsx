import React from 'react'
import { FaSignInAlt } from 'react-icons/fa'

function HomeGuest() {
  return (
    <>
    <section className="flex flex-col justify-center items-center text-3xl mb-5">
        <h1 className='font-bold'>
          Welcome to the Task Management System
        </h1>
        <div className='flex items-center text-slate-400 mt-3'>
          <FaSignInAlt />
          <p className='ml-3'>Please login to continue</p>
        </div>
      </section>

      <section className='form'>
        <form>
          <div className="form-group">
            <label htmlFor="username-register" className="text-muted mb-1">
              <small>Username</small>
            </label>
            <input id="username-register" name="username" className="form-control" type="text" placeholder="Enter your username" autoComplete="off" />
          </div>

          <div className="form-group">
            <label htmlFor="password-register" className="text-muted mb-1">
              <small>Password</small>
            </label>
            <input id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
          </div>

          <div className="form-group">
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-active btn-block">
              Login
            </button>

          </div>
        </form>
      </section>
    </>

  )
}

export default HomeGuest