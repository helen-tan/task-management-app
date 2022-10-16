import { useState } from 'react'

function CreateUser() {
    const [usernameInput, setUsernameInput] = useState("")
    const [emailInput, setEmailInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    // TODO: how to have multiple group inputs?
    // TODO: need to send a req to get all the groups in order to display them in the select dropdown

    const handleCreateUser = (e) => {
        e.preventDefault()
        console.log("submit")
    }

    return (
        <form onSubmit={handleCreateUser} className="border-solid border-2 border-slate-200 rounded p-4">
            <div className="md:flex gap-2 items-center">
                {/* Username */}
                <div className="form-control w-full max-w-xs">
                    <label htmlFor="create-user-username" className="label">
                        <span className="label-text">Username</span>
                    </label>
                    <input
                        onChange={(e) => setUsernameInput(e.target.value)}
                        id="create-user-username"
                        name="username"
                        className="input input-bordered w-full max-w-xs"
                        type="text"
                        placeholder="Enter a username"
                        autoComplete="off"
                    />
                </div>

                {/* Email */}
                <div className="form-control w-full max-w-xs">
                    <label htmlFor="create-user-email" className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        onChange={(e) => setEmailInput(e.target.value)}
                        id="create-user-email"
                        name="email"
                        className="input input-bordered w-full max-w-xs"
                        type="text"
                        placeholder="Enter an email"
                        autoComplete="off"
                    />
                </div>

                {/* Password */}
                <div className="form-control w-full max-w-xs">
                    <label htmlFor="create-user-password" className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input
                        onChange={(e) => setEmailInput(e.target.value)}
                        id="create-user-password"
                        name="email"
                        className="input input-bordered w-full max-w-xs"
                        type="text"
                        placeholder="Enter a password"
                        autoComplete="off"
                    />
                </div>

                {/* Groups */}
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Groups</span>
                    </label>
                    <select className="select select-bordered">
                        <option disabled selected>Pick one</option>
                        <option>Star Wars</option>
                        <option>Harry Potter</option>
                        <option>Lord of the Rings</option>
                        <option>Planet of the Apes</option>
                        <option>Star Trek</option>
                    </select>
                </div>
            </div>

            <button className="btn btn-sm mt-3" type="submit">Create user</button>

        </form>
    )
}

export default CreateUser