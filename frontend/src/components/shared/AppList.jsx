import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import EditApp from "./EditApp"
import Axios from "axios"
import Modal from 'react-modal'
import { BsPlusLg } from "react-icons/bs"

function AppList(props) {
    const [apps, setApps] = useState([])
    const [createAppModalIsOpen, setCreateAppModalIsOpen] = useState(false)
    const [editAppModalIsOpen, setEditAppModalIsOpen] = useState(false)
    const [appToEdit, setAppToEdit] = useState("")
    const [groupOptions, setGroupOptions] = useState([])
    const [newAppCount, setNewAppCount] = useState(0)
    const [isProjectLead, setIsProjectLead] = useState(false)

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
        // Check if user is in the group 'projectlead'
        setIsProjectLead(props.loggedInUserGroups.includes('projectlead')) // somehow double quotes "" will give false even if its true
        //console.log(props.loggedInUserGroups.includes('projectlead'))
    }, [props.loggedInUserGroups, newAppCount])

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
            width: '80%',
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

    const openCreateAppModal = () => setCreateAppModalIsOpen(true)
    const closeCreateAppModal = () => setCreateAppModalIsOpen(false)

    const openEditAppModal = (e, app_acronym) => {
        e.preventDefault()
        setEditAppModalIsOpen(true)
        setAppToEdit(app_acronym)
        //console.log(app_acronym)
    }
    const closeEditAppModal = () => {
        setEditAppModalIsOpen(false)
        setAppToEdit("")
    }

    const handleAppCreateSubmit = async (e) => {
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
                    {isProjectLead && (
                        <button onClick={openCreateAppModal} className="btn btn-sm mr-4 gap-2">
                            <BsPlusLg />
                            Create App
                        </button>
                    )}
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
                                    <Link to={`/application/${app.app_acronym}`}>
                                        <button className="btn btn-sm btn-outline mr-5">
                                            View
                                        </button>
                                    </Link>
                                    {isProjectLead && (
                                        <button onClick={e => openEditAppModal(e, app.app_acronym)} className="btn btn-sm">
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create App Modal */}
            <Modal
                scrollable={true}
                isOpen={createAppModalIsOpen}
                onRequestClose={closeCreateAppModal}
                style={customStyles}
                contentLabel="Create New Application"
            >
                <div className="flex justify-between mb-5">
                    <h2 className="font-bold text-xl">Create new Application</h2>
                    <button onClick={closeCreateAppModal}><strong>X</strong></button>
                </div>

                <form onSubmit={handleAppCreateSubmit}>
                    <div className="form-group">
                        <div className="mb-5 text-xs"><span className="text-rose-600">*</span> indicates a required field</div>

                        <div className="flex flex-col md:flex-row justify-between gap-1">
                            {/*App Name input */}
                            <div className="w-full">
                                <label htmlFor="create-app-name" className="font-semibold text-sm">Application Name <span className="text-rose-600">*</span></label>
                                <input
                                    className="form-control text-xs"
                                    onChange={(e) => setCreateAppNameInput(e.target.value)}
                                    type="text"
                                    placeholder="Enter a new app name here"
                                    value={createAppNameInput}
                                    id="create-app-name"
                                />
                            </div>
                            {/*R_number input */}
                            <div className="w-full">
                                <label htmlFor="create-app-rnum" className="font-semibold text-sm">R Number <span className="text-rose-600">*</span></label>
                                <input
                                    className="form-control text-xs"
                                    onChange={(e) => setCreateAppRnumInput(e.target.value)}
                                    type="number"
                                    min="1" step="1"
                                    placeholder="Enter a number to identify your app"
                                    value={createAppRnumInput}
                                    id="create-app-rnum"
                                />
                            </div>
                            {/*Start & End Date input */}
                            <div className="w-full">
                                <label htmlFor="create-app-startdate" className="font-semibold text-sm">Start Date <span className="text-rose-600">*</span></label>
                                <input
                                    onChange={(e) => setCreateAppStartdateInput(e.target.value)}
                                    type="date"
                                    className="text-xs"
                                    value={createAppStartdateInput}
                                    id="create-app-startdate"
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="create-app-enddate" className="font-semibold text-sm">End Date <span className="text-rose-600">*</span></label>
                                <input
                                    onChange={(e) => setCreateAppEnddateInput(e.target.value)}
                                    type="date"
                                    className="text-xs"
                                    value={createAppEnddateInput}
                                    id="create-app-enddate"
                                />
                            </div>
                        </div>

                        <div className="flex gap-1">
                            <div className="w-1/2">
                                {/*Description input */}
                                <label htmlFor="create-app-description" className="font-semibold text-sm">Description</label>
                                <textarea
                                    id="create-app-description"
                                    cols="30"
                                    rows="10"
                                    className="text-xs"
                                    placeholder="Say a few words about the application..."
                                    value={createAppDescriptionInput}
                                    onChange={(e) => setCreateAppDescriptionInput(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="w-1/2">
                                {/*App_permit_create */}
                                <div className="w-full">
                                    <label htmlFor="create-app-permitcreate" className="font-semibold text-sm">App_permit_Create <span className="text-rose-600">*</span></label>
                                    <select id="create-app-permitcreate" className="text-xs" value={createAppPermitCreate} onChange={(e) => setCreateAppPermitCreate(e.target.value)}>
                                        <option value="" disabled>Choose a group...</option>
                                        {groupOptions.map((groupOption) => (
                                            <option key={groupOption.group_name}>{groupOption.group_name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-1">
                                    {/*App_permit_open */}
                                    <div className="w-full">
                                        <label htmlFor="create-app-permitopen" className="font-semibold text-sm">App_permit_Open<span className="text-rose-600">*</span></label>
                                        <select id="create-app-permitopen" className="text-xs" value={createAppPermitOpen} onChange={(e) => setCreateAppPermitOpen(e.target.value)}>
                                            <option value="" disabled>Choose a group...</option>
                                            {groupOptions.map((groupOption) => (
                                                <option key={groupOption.group_name}>{groupOption.group_name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/*App_permit_toDoList */}
                                    <div className="w-full">
                                        <label htmlFor="create-app-permittodolist" className="font-semibold text-sm">App_permit_toDoList <span className="text-rose-600">*</span></label>
                                        <select id="create-app-permittodolist" className="text-xs" value={createAppPermitTodolist} onChange={(e) => setCreateAppPermitTodolist(e.target.value)}>
                                            <option value="" disabled>Choose a group...</option>
                                            {groupOptions.map((groupOption) => (
                                                <option key={groupOption.group_name}>{groupOption.group_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-1">
                                    {/*App_permit_Doing */}
                                    <div className="w-full">
                                        <label htmlFor="create-app-permitdoing" className="font-semibold text-sm">App_permit_Doing <span className="text-rose-600">*</span></label>
                                        <select id="create-app-permitdoing" className="text-xs" value={createAppPermitDoing} onChange={(e) => setCreateAppPermitDoing(e.target.value)}>
                                            <option value="" disabled>Choose a group...</option>
                                            {groupOptions.map((groupOption) => (
                                                <option key={groupOption.group_name}>{groupOption.group_name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/*App_permit_Done */}
                                    <div className="w-full">
                                        <label htmlFor="create-app-permitdone" className="font-semibold text-sm">App_permit_Done <span className="text-rose-600">*</span></label>
                                        <select id="create-app-permitdone" className="text-xs" value={createAppPermitDone} onChange={(e) => setCreateAppPermitDone(e.target.value)}>
                                            <option value="" disabled>Choose a group...</option>
                                            {groupOptions.map((groupOption) => (
                                                <option key={groupOption.group_name}>{groupOption.group_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="btn btn-sm btn-block" type="submit">Submit</button>
                </form>

            </Modal>

            {/* Edit App Modal */}
            {editAppModalIsOpen &&
                <EditApp
                    editAppModalIsOpen={editAppModalIsOpen}
                    closeEditAppModal={closeEditAppModal}
                    customStyles={customStyles}
                    appToEdit={appToEdit}
                    groupOptions={groupOptions}
                />
            }
            {/* <EditApp
                    editAppModalIsOpen={editAppModalIsOpen}
                    closeEditAppModal={closeEditAppModal}
                    customStyles={customStyles}
                    appToEdit={appToEdit}
                    groupOptions={groupOptions}
                /> */}

        </>
    )
}

export default AppList