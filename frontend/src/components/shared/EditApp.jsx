import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import Axios from "axios"
import Modal from 'react-modal'

function EditApp(props) {
    // Edit App form inputs
    const [editAppNameInput, setEditAppNameInput] = useState("")
    const [editAppStartdateInput, setEditAppStartdateInput] = useState("")
    const [editAppEnddateInput, setEditAppEnddateInput] = useState("")
    const [editAppRnumInput, setEditAppRnumInput] = useState("")
    const [editAppDescriptionInput, setEditAppDescriptionInput] = useState("")
    const [editAppPermitCreate, setEditAppPermitCreate] = useState("")
    const [editAppPermitOpen, setEditAppPermitOpen] = useState("")
    const [editAppPermitTodolist, setEditAppPermitTodolist] = useState("")
    const [editAppPermitDoing, setEditAppPermitDoing] = useState("")
    const [editAppPermitDone, setEditAppPermitDone] = useState("")

    const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
    const config = {
        headers: {
            Authorization: bearer_token
        }
    }

    // Fetch data of application
    const fetchAppData = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/api/applications/${props.appToEdit}`, config)
            console.log(response.data)
            if (response.data) {
                setEditAppNameInput(response.data.data[0].app_acronym)
                setEditAppStartdateInput(response.data.data[0].app_startdate.split("T")[0]) // Note: Bcos of timezone probs, getting 1 day before
                setEditAppEnddateInput(response.data.data[0].app_enddate.split("T")[0])     // Note: Bcos of timezone probs, getting 1 day before
                setEditAppRnumInput(response.data.data[0].app_rnumber)  
                setEditAppDescriptionInput(response.data.data[0].app_description)
                setEditAppPermitCreate(response.data.data[0].app_permit_create)
                setEditAppPermitOpen(response.data.data[0].app_permit_open)
                setEditAppPermitTodolist(response.data.data[0].app_permit_todolist)
                setEditAppPermitDoing(response.data.data[0].app_permit_doing)
                setEditAppPermitDone(response.data.data[0].app_permit_done)
            }

        } catch (err) {
            console.log("There was a problem")
        }
    }

    useEffect(() => {
        // Fetch the data of 1 application
        fetchAppData()
    }, [])

    const handleAppEditSubmit = async (e) => {
        e.preventDefault()

        let updatedAppData = {
            app_description: editAppDescriptionInput,
            app_startdate: editAppStartdateInput,
            app_enddate: editAppEnddateInput,
            app_permit_create: editAppPermitCreate,
            app_permit_open: editAppPermitOpen,
            app_permit_todolist: editAppPermitTodolist,
            app_permit_doing: editAppPermitDoing,
            app_permit_done: editAppPermitDone
        }

        // Send put request to update application details
        try {
            const response = await Axios.put(`http://localhost:5000/api/applications/${props.appToEdit}/updateApplication`, updatedAppData, config)
            if (response) {
                console.log(response.data)
                if (response.data.success === true) {
                    toast.success(response.data.message)
                    props.closeEditAppModal()
                } else {
                    toast.warning(response.data.message)
                }
            }
        } catch (err) {
            console.log(err)
            toast.error("There was a problem")
        }
    }

    return (
        <Modal
            scrollable={true}
            isOpen={props.editAppModalIsOpen}
            onRequestClose={props.closeEditAppModal}
            style={props.customStyles}
            contentLabel="Create New Application"
        >
            <div className="flex justify-between mb-5">
                <h2 className="font-bold text-xl">Edit Application</h2>
                <button onClick={props.closeEditAppModal}><strong>X</strong></button>
            </div>
           
            <form onSubmit={handleAppEditSubmit}>
                <div className="form-group">
                    {/*App Name */}
                    <div className="flex gap-2 mb-6 ml-1 mt-1">
                        <div htmlFor="edit-app-name" className="font-semibold">Application Name:</div>
                        <div>{editAppNameInput}</div>
                    </div>
                    {/* <input
                        className="form-control"
                        onChange={(e) => setEditAppNameInput(e.target.value)}
                        type="text"
                        placeholder="Rename the app here"
                        value={editAppNameInput}
                        id="edit-app-name"
                        disabled
                    /> */}

                    {/*R_number */}
                    <div className="flex gap-2 mb-6 ml-1 mt-1">
                        <div htmlFor="edit-app-rnum" className="font-semibold">R Number:</div>
                        <div>{editAppRnumInput}</div>
                    </div>
                    {/* <input
                        className="form-control"
                        onChange={(e) => setEditAppRnumInput(e.target.value)}
                        type="number"
                        placeholder="Enter a number to identify your app"
                        value={editAppRnumInput}
                        id="edit-app-rnum"
                        disabled
                    /> */}

                    <div className="h-px bg-gray-400 mb-6"></div>

                    {/*Start & End Date input */}
                    <div className="flex flex-col md:flex-row justify-between gap-1">
                        <div className="w-full">
                            <label htmlFor="edit-app-startdate" className="font-semibold">Start Date:</label>
                            <input
                                onChange={(e) => setEditAppStartdateInput(e.target.value)}
                                type="date"
                                value={editAppStartdateInput}
                                id="edit-app-startdate"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="edit-app-enddate" className="font-semibold">End Date:</label>
                            <input
                                onChange={(e) => setEditAppEnddateInput(e.target.value)}
                                type="date"
                                value={editAppEnddateInput}
                                id="edit-app-enddate"
                                required
                            />
                        </div>
                    </div>


                    {/*Description input */}
                    <label htmlFor="edit-app-description" className="font-semibold">Description:</label>
                    <textarea
                        id="edit-app-description"
                        cols="30"
                        rows="5"
                        placeholder="Say a few words about the application..."
                        value={editAppDescriptionInput}
                        onChange={(e) => setEditAppDescriptionInput(e.target.value)}
                    ></textarea>


                    <div className="font-bold text-base mb-5">Groups permitted to:</div>

                    {/*App_permit_create */}
                    <label htmlFor="edit-app-permitcreate" className="font-semibold">Create Tasks (App_permit_Create):</label>
                    <select id="edit-app-permitcreate" required value={editAppPermitCreate} onChange={(e) => setEditAppPermitCreate(e.target.value)}>
                        <option value="" disabled>Choose a group...</option>
                        {props.groupOptions.map((groupOption) => (
                            <option key={groupOption.group_name}>{groupOption.group_name}</option>
                        ))}
                    </select>

                    {/*App_permit_open */}
                    <label htmlFor="edit-app-permitopen" className="font-semibold">Shift Tasks to To-do (App_permit_Open):</label>
                    <select id="edit-app-permitopen" required value={editAppPermitOpen} onChange={(e) => setEditAppPermitOpen(e.target.value)}>
                        <option value="" disabled>Choose a group...</option>
                        {props.groupOptions.map((groupOption) => (
                            <option key={groupOption.group_name}>{groupOption.group_name}</option>
                        ))}
                    </select>

                    {/*App_permit_toDoList */}
                    <label htmlFor="edit-app-permittodolist" className="font-semibold">Shift Tasks to Doing (App_permit_toDoList):</label>
                    <select id="edit-app-permittodolist" required value={editAppPermitTodolist} onChange={(e) => setEditAppPermitTodolist(e.target.value)}>
                        <option value="" disabled>Choose a group...</option>
                        {props.groupOptions.map((groupOption) => (
                            <option key={groupOption.group_name}>{groupOption.group_name}</option>
                        ))}
                    </select>

                    {/*App_permit_Doing */}
                    <label htmlFor="edit-app-permitdoing" className="font-semibold">Shift Tasks to Done (App_permit_Doing):</label>
                    <select id="edit-app-permitdoing" required value={editAppPermitDoing} onChange={(e) => setEditAppPermitDoing(e.target.value)}>
                        <option value="" disabled>Choose a group...</option>
                        {props.groupOptions.map((groupOption) => (
                            <option key={groupOption.group_name}>{groupOption.group_name}</option>
                        ))}
                    </select>

                    {/*App_permit_Done */}
                    <label htmlFor="edit-app-permitdone" className="font-semibold">Close Tasks (App_permit_Done):</label>
                    <select id="edit-app-permitdone" required value={editAppPermitDone} onChange={(e) => setEditAppPermitDone(e.target.value)}>
                        <option value="" disabled>Choose a group...</option>
                        {props.groupOptions.map((groupOption) => (
                            <option key={groupOption.group_name}>{groupOption.group_name}</option>
                        ))}
                    </select>
                </div>

                <button className="btn btn-sm btn-block mt-3" type="submit">Submit</button>
            </form>

        </Modal>
    )
}

export default EditApp