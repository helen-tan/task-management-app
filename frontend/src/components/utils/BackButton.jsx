import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowCircleLeft } from 'react-icons/fa'

function BackButton({ url }) {
  return (
    <Link to={url} className="btn btn-outline btn-small btn-active gap-2">
       <FaArrowCircleLeft/> Back
    </Link>
  )
}

export default BackButton