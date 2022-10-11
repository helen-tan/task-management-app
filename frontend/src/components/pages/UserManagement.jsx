import React from 'react'
import Page from '../utils/Page'
import BackButton from '../utils/BackButton'

function UserManagement() {
  return (
    <Page title="User Management">
        <div className="flex justify-start mb-5 ml-5">
            <BackButton url='/'/>
        </div>
        
        <h1 className='text-2xl'><strong>User Management</strong></h1>
    </Page>
  )
}

export default UserManagement