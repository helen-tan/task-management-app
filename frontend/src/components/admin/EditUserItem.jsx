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
    <tr>
      <td className="font-semibold">{props.index + 1}</td>

      <td>{props.user.username}</td>

      <td>
        <input
          type='text'
          className="bg-slate-100 border-solid border-2 border-slate-300 p-2 rounded"
          required="required"
          placeholder="email"
          name="email"
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

        {/*TODO: Handle the onChange to update form state */}
        <Select
          className="w-56"
          placeholder="Select group(s)"
          options={groupOptions}
          isMulti={true}
          name="groupz"
          onChange={props.setEditFormGroups}
        />

        {/* <Select
          className="w-56"
          placeholder="Select group(s)"
          options={groupOptions}
          name="groupz"
          isMulti={true}
          isSearchable
          value={props.editFormData.groupz} // Causing infinite loop somehow?
          onChange={props.handleEditFormChange}
        /> */}

      </td>

      <td>
        <input
          type='text'
          className="bg-slate-100 border-solid border-2 border-slate-300 p-2 rounded"
          required="required"
          placeholder="status"
          name="is_active"
          value={props.editFormStatus}
          onChange={(e) => props.setEditFormStatus(e.target.value)}
        ></input>
      </td>

      <td>
        <input
          type='text'
          className="bg-slate-100 border-solid border-2 border-slate-300 p-2 rounded"
          required="required"
          placeholder="password"
          name="password"
          onChange={(e) => props.setEditFormPassword(e.target.value)}
        ></input>
      </td>

      <td className="flex gap-2">
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