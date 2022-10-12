import React from 'react'
import Page from '../utils/Page'

function Dashboard() {
  return (
    <Page title="Dashboard">
        <h1>Welcome <strong>{sessionStorage.getItem("username")}</strong></h1>
    </Page>
  )
}

export default Dashboard