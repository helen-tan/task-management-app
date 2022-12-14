import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSignInAlt } from 'react-icons/fa'
import Page from '../utils/Page'
import Axios from 'axios'
import { toast } from 'react-toastify'

function Login(props) {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const navigate = useNavigate()

  useEffect(() => {
    // Already Logged-in users should not access this login page - navigate back to the dahsboard
    // if (sessionStorage.getItem("username") !== null){
    //   navigate('/dashboard')
    // }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Axios to send a req to the backend
    try {
      const response = await Axios.post('http://localhost:5000/api/users/login', {
        username,
        password
      })
      if (response.data) {
        console.log(response.data)
        if (response.data.success === true) {
          toast.success(response.data.message)
          // persist jwt token in local storage (don't store username)
          sessionStorage.setItem("token", response.data.token)
          //console.log('in login loggedinuser is'+response.data.data[0].username)
          props.setLoggedIn(true)
          // props.setLoggedInUser(response.data.data[0].username)
          navigate('/dashboard')
        } else {
          toast.warning(response.data.message)
        }
      } else {
        console.log('There was an error')
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response.data) // Error msg set in backend
      }
    }
  }

  return (
    <Page title="Welcome!">
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
        <form onSubmit={handleSubmit} className="w-3/6 mx-auto">
          <div className="form-group">
            <label htmlFor="username-register" className="text-muted mb-1">
              <small>Username</small>
            </label>
            <input onChange={(e) => setUsername(e.target.value)} id="username-register" name="username" className="form-control" type="text" placeholder="Enter your username" autoComplete="off" />
          </div>

          <div className="form-group">
            <label htmlFor="password-register" className="text-muted mb-1">
              <small>Password</small>
            </label>
            <input onChange={(e) => setPassword(e.target.value)} id="password-register" name="password" className="form-control" type="password" placeholder="Enter your password" />
          </div>

          <div className="form-group">
            <button type="submit" className="mt-4 btn btn-md btn-active btn-block">
              Login
            </button>
          </div>
        </form>

      </section>
    </Page>

  )
}

export default Login