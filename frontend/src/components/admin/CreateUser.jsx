import { useState, useEffect } from 'react'
import Axios from 'axios'
import Select from 'react-select'
import { FaPlus } from "react-icons/fa"
import { toast } from 'react-toastify'

function CreateUser(props) {
    const [usernameInput, setUsernameInput] = useState("")
    const [emailInput, setEmailInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const [groupsInput, setGroupsInput] = useState([""])

    const [groupOptions, setGroupOptions] = useState([])

    const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
    const config = {
        headers: {
            Authorization: bearer_token
        }
    }

    useEffect(() => {
        // Fetch All groups
        async function fetchAllGroups() {
            try {
                const response = await Axios.get(`http://localhost:5000/api/groups/`, config)
                //console.log(response.data)
                //console.log(response.data.data)

                let options = [] // Select component from 'react-select' has a prop 'options' with only accepts an array with items of objects <{value:string,label:string}>

                response.data.data.forEach((group) => {
                    //console.log(group.group_name)
                    options.push({
                        value: group.group_name,
                        label: group.group_name
                    })
                })
                // console.log(options)

                setGroupOptions(options)
            } catch (err) {
                console.log("There was a problem")
            }
        }

        fetchAllGroups()
    }, [props.count])

    const handleCreateUser = async (e) => {
        e.preventDefault()
        //console.log(groupsInput)

        let groupsInputArr = []

        // Reformat groupsInput from [{value: 'xxx', label: 'xxx'}, {value: 'yyy', label: 'yyy'}] to ["xxx", "yyy"] 
        groupsInput.forEach((groupInput) => {
            groupsInputArr.push(groupInput.value)
        })

      
        console.log(groupsInputArr)


        const newUserData = {
            username: usernameInput,
            email: emailInput,
            password: passwordInput,
            groupz: groupsInputArr
        }

        console.log(newUserData)
        // Send post request to create user
        try {
            const response = await Axios.post(`http://localhost:5000/api/users`, newUserData, config)
            if (response) {
                console.log(response.data)
                if (response.data.success === true) {
                    toast.success(response.data.message)
                    // clear user inputs
                    document.getElementById("create-user-username").value = "" // or setState?
                    document.getElementById("create-user-email").value = ""
                    document.getElementById("create-user-password").value = ""

                } else {
                    toast.warning(response.data.message)
                }
            }
        } catch (err) {
            console.log(err)
            if (err.response.data.message === "ER_DUP_ENTRY") {
                toast.warning("This user already exists")
            } else {
                toast.error("There was a problem")
            }
        }
    }

    return (
        <form onSubmit={handleCreateUser} className="border-solid border-2 border-slate-200 rounded p-4">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
                {/* Username */}
                <div className="form-control w-full">
                    <label htmlFor="create-user-username" className="label">
                        <span className="label-text">Username</span>
                    </label>
                    <input
                        onChange={(e) => setUsernameInput(e.target.value)}
                        id="create-user-username"
                        name="username"
                        className="input input-bordered w-full"
                        type="text"
                        placeholder="Enter a username"
                        autoComplete="off"
                    />
                </div>

                {/* Email */}
                <div className="form-control w-full">
                    <label htmlFor="create-user-email" className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        onChange={(e) => setEmailInput(e.target.value)}
                        id="create-user-email"
                        name="email"
                        className="input input-bordered w-full"
                        type="text"
                        placeholder="Enter an email"
                        autoComplete="off"
                    />
                </div>

                {/* Password */}
                <div className="form-control w-full">
                    <label htmlFor="create-user-password" className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input
                        onChange={(e) => setPasswordInput(e.target.value)}
                        id="create-user-password"
                        name="email"
                        className="input input-bordered w-full"
                        type="text"
                        placeholder="Enter a password"
                        autoComplete="off"
                    />
                </div>

                {/* Groups */}
                <div className="form-control w-full">
                    <label htmlFor="create-user-groups" className="label">
                        <span className="label-text">Group(s)</span>
                    </label>

                    <Select
                        id="create-user-groups"
                        placeholder="Select group(s)"
                        options={groupOptions}
                        isMulti={true}
                        onChange={setGroupsInput}
                        isSearchable
                    />
                </div>
            </div>

            <div className="flex justify-center lg:justify-end">
                <button className="btn btn-sm mt-3 gap-1" type="submit"><FaPlus />Create user</button>
            </div>

        </form>
    )
}

export default CreateUser