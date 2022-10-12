import React from 'react'
import Page from '../utils/Page'

function Home() {
  return (
    <Page title="Home">
        <h1>Welcome <strong>{sessionStorage.getItem("username")}</strong></h1>
    </Page>
  )
}

export default Home