// Editable row in table
import { useState, useEffect } from 'react'
import Axios from 'axios'
import Select from 'react-select'

function EditUserItem(props) {
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


  return (
    <tr className="text-sm">
      <td className="font-semibold">{props.index + 1}</td>

      <td className="font-semibold">{props.user.username}</td>

      <td>
        <label htmlFor="edit-user-email" className="label pt-0">
          <span className="label-text text-cyan-700 font-semibold">Edit email:</span>
        </label>
        <input
          type='text'
          className="w-44 border-solid border-2 border-slate-300 p-2 rounded"
          required="required"
          placeholder="email"
          name="email"
          id="edit-user-email"
          value={props.editFormEmail}
          onChange={(e) => props.setEditFormEmail(e.target.value)}
        ></input>
      </td>

      <td>
        {/* <input
          type='text'
          className="bg-slate-100 border-solid border-2 border-slate-300 p-2 rounded"
          required="required"
          placeholder="groups"
          name="groupz"
          value={props.editFormGroups}
          onChange={(e) => props.setEditFormGroups(e.target.value)}
        ></input> */}

        <label htmlFor="edit-user-groups" className="label pt-0">
          <span className="label-text text-cyan-700 font-semibold">Edit groups:</span>
        </label>
        <Select
          className="w-56 border-solid border-2 border-slate-300 rounded"
          placeholder="Select group(s)"
          options={groupOptions}
          isMulti={true}
          id="edit-user-groups"
          name="groupz"
          value={props.editFormGroups}
          onChange={props.setEditFormGroups}
        />
      </td>

      <td>
        <label htmlFor="edit-user-status" className="label pt-0">
          <span className="label-text text-cyan-700 font-semibold">Edit account status:</span>
        </label>

        <select 
          className="select w-36 border-solid border-2 border-slate-300 rounded"
          placeholder="Select status"
          id="edit-user-status"
          name="is_active"
          value={props.editFormStatus}
          onChange={(e) => props.setEditFormStatus(e.target.value)}
        >
          <option value="1">active</option>
          <option value="0">inactive</option>
        </select>
        
        {/* <input
          type='text'
          className="w-36 border-solid border-2 border-slate-300 p-2 rounded"
          required="required "
          placeholder="status"
          name="is_active"
          id="edit-user-status"
          value={props.editFormStatus}
          onChange={(e) => props.setEditFormStatus(e.target.value)}
        ></input> */}

      </td>

      <td>
        <label htmlFor="edit-user-password" className="label pt-0">
          <span className="label-text text-cyan-700 font-semibold">New password:</span>
        </label>
        <input
          type='text'
          className="w-36 border-solid border-2 border-slate-300 p-2 rounded"
          required="required"
          placeholder="password"
          id="edit-user-password"
          name="password"
          onChange={(e) => props.setEditFormPassword(e.target.value)}
        ></input>
      </td>

      <td className="flex flex-col gap-2">
        <button className="btn btn-sm">
          Save
        </button>
        <button onClick={props.handleCancelClick} className="btn btn-sm">
          Cancel
        </button>
      </td>
    </tr>
  )
}

export default EditUserItem