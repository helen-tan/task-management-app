import { useState, useEffect } from "react"
import Axios from "axios"
import Modal from 'react-modal'
import { BsPlusLg } from "react-icons/bs"

function AppList() {
    const [apps, setApps] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false)

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
            overflowY: "auto"
        },
        overlay: { 
            zIndex: 1000 ,
            background: "rgba(0, 0, 0, 0.5)",
            //overflowY: "auto"
        }
    };

    const openModal = () => setModalIsOpen(true)
    const closeModal = () => setModalIsOpen(false)

    const handleAppCreate = (e) => {
        e.preventDefault()
        console.log('app create')
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
                            //onChange={(e) => setCreateGroupInput(e.target.value)}
                            type="text"
                            placeholder="Enter a new app name here"
                            //value={createGroupInput}
                            id="create-app-name"
                        />

                        {/*Start & End Date input */}
                        <div className="flex flex-col md:flex-row justify-between gap-1">
                            <div className="w-full">
                                <label htmlFor="create-app-startdate" className="font-semibold">Start Date:</label>
                                <input
                                    //onChange={(e) => setCreateGroupInput(e.target.value)}
                                    type="date"
                                    //value={createGroupInput}
                                    id="create-app-startdate"
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="create-app-enddate" className="font-semibold">End Date:</label>
                                <input
                                    //onChange={(e) => setCreateGroupInput(e.target.value)}
                                    type="date"
                                    //value={createGroupInput}
                                    id="create-app-enddate"
                                />
                            </div>
                        </div>

                        {/*Description input */}
                        <label htmlFor="create-app-description" className="font-semibold">Description:</label>
                        <textarea id="create-app-description" cols="30" rows="5"></textarea>

                    
                        <div className="font-bold text-base mb-5">Groups permitted to:</div>
                        {/*App_permit_create */}
                        <label htmlFor="create-app-permitcreate" className="font-semibold">Create Tasks:</label>
                        <input
                            className="form-control"
                            //onChange={(e) => setCreateGroupInput(e.target.value)}
                            type="text"
                            //value={createGroupInput}
                            id="create-app-permitcreate"
                        />

                        {/*App_permit_open */}
                        <label htmlFor="create-app-permitopen" className="font-semibold">Shift Tasks to To-do:</label>
                        <input
                            className="form-control"
                            //onChange={(e) => setCreateGroupInput(e.target.value)}
                            type="text"
                            //value={createGroupInput}
                            id="create-app-permitopen"
                        />

                        {/*App_permit_toDoList */}
                        <label htmlFor="create-app-permittodolist" className="font-semibold">Shift Tasks to Doing:</label>
                        <input
                            className="form-control"
                            //onChange={(e) => setCreateGroupInput(e.target.value)}
                            type="text"
                            //value={createGroupInput}
                            id="create-app-permittodolist"
                        />

                        {/*App_permit_Doing */}
                        <label htmlFor="create-app-permitdoing" className="font-semibold">Shift Tasks to Done:</label>
                        <input
                            className="form-control"
                            //onChange={(e) => setCreateGroupInput(e.target.value)}
                            type="text"
                            //value={createGroupInput}
                            id="create-app-permitdoing"
                        />

                        {/*App_permit_Done */}
                        <label htmlFor="create-app-permitdone" className="font-semibold">Close Tasks:</label>
                        <input
                            className="form-control"
                            //onChange={(e) => setCreateGroupInput(e.target.value)}
                            type="text"
                            //value={createGroupInput}
                            id="create-app-permitdone"
                        />
                      

                    </div>

                    <button className="btn btn-sm btn-block mt-3" type="submit">Submit</button>
                </form>

            </Modal>
        </>
    )
}

export default AppList