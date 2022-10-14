import Page from '../utils/Page'

function Dashboard() {
  return (
    <Page title="Dashboard">
      <div className="h-screen">
        <h1>Welcome <strong>{sessionStorage.getItem("username")}</strong></h1>
      </div>
    </Page>
  )
}

export default Dashboard