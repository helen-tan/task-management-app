import React from 'react'

function Home() {
  return (
    <div>
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

        <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
          Login
        </button>
      </form>
    </div>
  )
}

export default Home