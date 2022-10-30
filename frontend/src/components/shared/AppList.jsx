import { useState, useEffect } from "react"
import Axios from "axios"
import { BsPlusLg } from "react-icons/bs";

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
        <div className="my-10 md:w-6/12 mx-auto">

            <div className="flex justify-between items-center">
                <div className="flex flex-col items-start">
                    <h2 className="text-2xl font-bold my-4 ml-4">Applications</h2>
                    <p className="mb-4 ml-4 text-left">Select an application to view its Kanban board.</p>
                </div>
                {/*Create new app button */}
                <button className="btn btn-sm mr-4 gap-2">
                    <BsPlusLg />
                    Create App
                </button>
            </div>

            <table className="table w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>App Name</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {apps.map((app, index) => (
                        <tr key={app.app_acronym}>
                            <th>{index + 1}</th>
                            <td>{app.app_acronym}</td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-outline mr-5">
                                    View
                                </button>
                                <button className="btn btn-sm">
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AppList