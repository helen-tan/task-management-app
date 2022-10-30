import { useState, useEffect } from "react"
import Axios from "axios"

function AppList() {
    const [apps, setApps] = useState([])

    const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
    const config = {
        headers: {
            Authorization: bearer_token
        }
    }

    const fetchAllApps = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/api/applications`, config)
            if (response.data) {
                setApps(response.data.data)
                //console.log(response.data.data)
            }
        } catch (err) {
            console.log("There was a problem")
        }
    }

    useEffect(() => {
        fetchAllApps()
    }, [])

    return (
        <div>
            <div>
                <h2>Applications</h2>
                <p>Select an application to view its Kanban board.</p>
            </div>
    
            {apps.map((app) => (
                <div key={app.app_acronym}>{app.app_acronym}</div>
            ))}
        </div>
    )
}

export default AppList