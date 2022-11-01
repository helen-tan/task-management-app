import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowCircleLeft } from 'react-icons/fa'

function BackLink({ url }) {
  return (
    <Link to={url} className="flex items-center text-xs gap-2">
       <FaArrowCircleLeft/> Back
    </Link>
  )
}

export default BackLink