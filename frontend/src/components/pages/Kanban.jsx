import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import SideMenu from "../shared/SideMenu"
import BackLink from "../utils/BackLink"
import Axios from "axios"
import Spinner from "../utils/Spinner"

function Kanban() {
    const [loading, setLoading] = useState(true)
    const [app, setApp] = useState({})
    const { app_acronym, app_rnumber, app_startdate, app_enddate } = app // Destructure some values returned and stored in 'app'

    const params = useParams()

    const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
    const config = {
        headers: {
            Authorization: bearer_token
        }
    }

    const fetchAppData = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/api/applications/${params.app_acronym}`, config)
            if (response.data) {
                console.log(response.data)
                // console.log(response.data.data[0])
                setApp(response.data.data[0])
                setLoading(false)
            }

        } catch (err) {
            console.log("There was a problem")
        }
    }


    useEffect(() => {
        // Fetch application details (to display app name & use selected details - r_number)
        fetchAppData()
    }, [])

    if (loading) {
        return <Spinner />
    } else {
        return (
            <div className="flex justify-between h-screen">
                <SideMenu app_acronym={app_acronym} />

                <div className="grow columns-bg">
                    {/* Kanban board header */}
                    <div className="flex justify-between items-center bg-white pl-10 pr-40 pt-8 pb-4 text-start">
                        <div>
                            <BackLink url='/dashboard' />
                            <h1 className="font-bold text-xl mb-2 mt-6">{app_acronym}</h1>
                            <div className="text-sm mb-4"><span className="font-medium">R Number - </span>{app_rnumber}</div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="text-sm"><span className="font-semibold">Start Date: </span>{app_startdate.split("T")[0]}</div>
                            <div className="text-sm"><span className="font-semibold">End Date: </span>{app_enddate.split("T")[0]}</div>
                        </div>
                    </div>

                    {/* Columns */}
                    <div className="grid grid-cols-5 grid-flow-col px-5 pt-5 gap-2">
                        <div className="border border-slate-300 rounded text-start pl-5 py-1 font-semibold">Open</div>
                        <div className="border border-slate-300 rounded text-start pl-5 py-1 font-semibold">Todo</div>
                        <div className="border border-slate-300 rounded text-start pl-5 py-1 font-semibold">Doing</div>
                        <div className="border border-slate-300 rounded text-start pl-5 py-1 font-semibold">Done</div>
                        <div className="border border-slate-300 rounded text-start pl-5 py-1 font-semibold">Closed</div>
                    </div>

                    <div className="grid grid-cols-5 grid-flow-col px-5 pt-2 gap-2 h-80">
                        <div className="border border-slate-300 rounded  overflow-y-auto">
                            <div className="border border-slate-300 rounded bg-white mx-auto mt-2 h-10 w-11/12">test</div>
                        </div>
                        <div className="border border-slate-300 rounded">tasks</div>
                        <div className="border border-slate-300 rounded">tasks</div>
                        <div className="border border-slate-300 rounded">tasks</div>
                        <div className="border border-slate-300 rounded">tasks</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Kanban