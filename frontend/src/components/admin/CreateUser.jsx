import { useState, useEffect } from 'react'
import Axios from 'axios'
import Select from 'react-select'
import { FaPlus } from "react-icons/fa"

function CreateUser() {
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
    }, [])

    const handleCreateUser = (e) => {
        e.preventDefault()
        console.log("submit")
        console.log(groupsInput)
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
                        onChange={(e) => setEmailInput(e.target.value)}
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
                    <label className="label">
                        <span className="label-text">Group(s)</span>
                    </label>
                 
                    <Select
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