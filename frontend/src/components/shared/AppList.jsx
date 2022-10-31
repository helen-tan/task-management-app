import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import Axios from "axios"
import Modal from 'react-modal'
import { BsPlusLg } from "react-icons/bs"

function AppList() {
    const [apps, setApps] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [groupOptions, setGroupOptions] = useState([])
    const [newAppCount, setNewAppCount] = useState(0)

    // Create App form inputs
    const [createAppNameInput, setCreateAppNameInput] = useState("")
    const [createAppStartdateInput, setCreateAppStartdateInput] = useState("")
    const [createAppEnddateInput, setCreateAppEnddateInput] = useState("")
    const [createAppRnumInput, setCreateAppRnumInput] = useState("")
    const [createAppDescriptionInput, setCreateAppDescriptionInput] = useState("")
    const [createAppPermitCreate, setCreateAppPermitCreate] = useState("")
    const [createAppPermitOpen, setCreateAppPermitOpen] = useState("")
    const [createAppPermitTodolist, setCreateAppPermitTodolist] = useState("")
    const [createAppPermitDoing, setCreateAppPermitDoing] = useState("")
    const [createAppPermitDone, setCreateAppPermitDone] = useState("")

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

    // Fetch All groups
    const fetchAllGroups = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/api/groups/`, config)
            //console.log(response.data)
            //console.log(response.data.data)
            setGroupOptions(response.data.data)
        } catch (err) {
            console.log("There was a problem")
        }
    }

    useEffect(() => {
        fetchAllApps()
        fetchAllGroups()
    }, [newAppCount])

    // Modal: Create New Application
    Modal.setAppElement('#root');

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            height: '90vh',
            borderRadius: ".5em",
            overflowY: "auto",
        },
        overlay: {
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.5)",
            //overflowY: "auto"
        }
    };

    const openModal = () => setModalIsOpen(true)
    const closeModal = () => setModalIsOpen(false)

    const handleAppCreate = async (e) => {
        e.preventDefault()

        let new_app = {
            app_acronym: createAppNameInput,
            app_description: createAppDescriptionInput,
            app_rnumber: createAppRnumInput,
            app_startdate: createAppStartdateInput,
            app_enddate: createAppEnddateInput,
            app_permit_create: createAppPermitCreate,
            app_permit_open: createAppPermitOpen,
            app_permit_todolist: createAppPermitTodolist,
            app_permit_doing: createAppPermitDoing,
            app_permit_done: createAppPermitDone
        }

        // Send post request to create new application
        try {
            const response = await Axios.post(`http://localhost:5000/api/applications`, new_app, config)
            if (response) {
                console.log(response.data)
                if (response.data.success === true) {
                    toast.success(response.data.message)
                    // clear user input
                    setCreateAppNameInput("")
                    setCreateAppStartdateInput("")
                    setCreateAppEnddateInput("")
                    setCreateAppRnumInput("")
                    setCreateAppDescriptionInput("")
                    setCreateAppPermitCreate("")
                    setCreateAppPermitOpen("")
                    setCreateAppPermitTodolist("")
                    setCreateAppPermitDoing("")
                    setCreateAppPermitDone("")

                    // increment count state (to induce re render of App list to include new App instantly)
                    setNewAppCount(prevState => prevState + 1)

                } else {
                    toast.warning(response.data.message)
                }
            }
        } catch (err) {
            console.log(err)
        }

        console.log(new_app)
    }

    return (
        <>
            <div className="my-10 md:w-6/12 mx-auto">

                <div className="flex justify-between items-center">
                    <div className="flex flex-col items-start">
                        <h2 className="text-2xl font-bold my-4 ml-4">Applications</h2>
                        <p className="mb-4 ml-4 text-left">Select an application to view its Kanban board.</p>
                    </div>
                    {/*Create new app button */}
                    <button onClick={openModal} className="btn btn-sm mr-4 gap-2">
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

            <Modal
                scrollable={true}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Create New Application"
            >
                <div className="flex justify-between mb-5">
                    <h2 className="font-bold text-xl">Create new Application</h2>
                    <button onClick={closeModal}><strong>X</strong></button>
                </div>

                <form onSubmit={handleAppCreate}>
                    <div className="form-group">
                        {/*App Name input */}
                        <label htmlFor="create-app-name" className="font-semibold">Application Name:</label>
                        <input
                            className="form-control"
                            onChange={(e) => setCreateAppNameInput(e.target.value)}
                            type="text"
                            placeholder="Enter a new app name here"
                            value={createAppNameInput}
                            id="create-app-name"
                        />

                        {/*Start & End Date input */}
                        <div className="flex flex-col md:flex-row justify-between gap-1">
                            <div className="w-full">
                                <label htmlFor="create-app-startdate" className="font-semibold">Start Date:</label>
                                <input
                                    onChange={(e) => setCreateAppStartdateInput(e.target.value)}
                                    type="date"
                                    value={createAppStartdateInput}
                                    id="create-app-startdate"
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="create-app-enddate" className="font-semibold">End Date:</label>
                                <input
                                    onChange={(e) => setCreateAppEnddateInput(e.target.value)}
                                    type="date"
                                    value={createAppEnddateInput}
                                    id="create-app-enddate"
                                />
                            </div>
                        </div>

                        {/*R_number input */}
                        <label htmlFor="create-app-rnum" className="font-semibold">R Number:</label>
                        <input
                            className="form-control"
                            onChange={(e) => setCreateAppRnumInput(e.target.value)}
                            type="number"
                            placeholder="Enter a number to identify your app"
                            value={createAppRnumInput}
                            id="create-app-rnum"
                        />

                        {/*Description input */}
                        <label htmlFor="create-app-description" className="font-semibold">Description:</label>
                        <textarea
                            id="create-app-description"
                            cols="30"
                            rows="5"
                            placeholder="Say a few words about the application..."
                            value={createAppDescriptionInput}
                            onChange={(e) => setCreateAppDescriptionInput(e.target.value)}
                        ></textarea>


                        <div className="font-bold text-base mb-5">Groups permitted to:</div>

                        {/*App_permit_create */}
                        <label htmlFor="create-app-permitcreate" className="font-semibold">Create Tasks (App_permit_Create):</label>
                        <select id="create-app-permitcreate" value={createAppPermitCreate} onChange={(e) => setCreateAppPermitCreate(e.target.value)}>
                            <option value="" disabled>Choose a group...</option>
                            {groupOptions.map((groupOption) => (
                                <option key={groupOption.group_name}>{groupOption.group_name}</option>
                            ))}
                        </select>

                        {/*App_permit_open */}
                        <label htmlFor="create-app-permitopen" className="font-semibold">Shift Tasks to To-do (App_permit_Open):</label>
                        <select id="create-app-permitopen" value={createAppPermitOpen} onChange={(e) => setCreateAppPermitOpen(e.target.value)}>
                            <option value="" disabled>Choose a group...</option>
                            {groupOptions.map((groupOption) => (
                                <option key={groupOption.group_name}>{groupOption.group_name}</option>
                            ))}
                        </select>

                        {/*App_permit_toDoList */}
                        <label htmlFor="create-app-permittodolist" className="font-semibold">Shift Tasks to Doing (App_permit_toDoList):</label>
                        <select id="create-app-permittodolist" value={createAppPermitTodolist} onChange={(e) => setCreateAppPermitTodolist(e.target.value)}>
                            <option value="" disabled>Choose a group...</option>
                            {groupOptions.map((groupOption) => (
                                <option key={groupOption.group_name}>{groupOption.group_name}</option>
                            ))}
                        </select>

                        {/*App_permit_Doing */}
                        <label htmlFor="create-app-permitdoing" className="font-semibold">Shift Tasks to Done (App_permit_Doing):</label>
                        <select id="create-app-permitdoing" value={createAppPermitDoing} onChange={(e) => setCreateAppPermitDoing(e.target.value)}>
                            <option value="" disabled>Choose a group...</option>
                            {groupOptions.map((groupOption) => (
                                <option key={groupOption.group_name}>{groupOption.group_name}</option>
                            ))}
                        </select>

                        {/*App_permit_Done */}
                        <label htmlFor="create-app-permitdone" className="font-semibold">Close Tasks (App_permit_Done):</label>
                        <select id="create-app-permitdone" value={createAppPermitDone} onChange={(e) => setCreateAppPermitDone(e.target.value)}>
                            <option value="" disabled>Choose a group...</option>
                            {groupOptions.map((groupOption) => (
                                <option key={groupOption.group_name}>{groupOption.group_name}</option>
                            ))}
                        </select>
                    </div>

                    <button className="btn btn-sm btn-block mt-3" type="submit">Submit</button>
                </form>

            </Modal>
        </>
    )
}

export default AppList