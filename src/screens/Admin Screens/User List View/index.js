import React, { useEffect, useRef, useState } from 'react'
import Header from '../../../components/Header'
import PrimaryHeading from '../../../components/Primary Headings'
import SecondaryHeading from '../../../components/Secondary Heading'
import DataTable, { createTheme } from 'react-data-table-component'
import './style.css'
import { Select } from 'antd'
import Dropdown from '../../../components/Dropdown'
import UserDetailsModal from '../../../components/Modals/User Detail Modal'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { fetchUserList } from './../../../services/users.service'
import API from '../../../utils/api'
import { toast } from 'react-toastify'
const UserListView = () => {
  // states
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [changeModal, setChangeModal] = useState('')
  const [filter, setFilter] = useState(null)
  const [filterCheckbox, setFilterCheckbox] = useState('')

  const [selectedRowsState, setSelectedRowsState] = useState([])
  const dropdownData = ['PMK Administrator', 'Content Manager', 'User']

  const filter1Ref = useRef()
  const filter2Ref = useRef()
  const filter3Ref = useRef()
  const filter4Ref = useRef()
  const filterFromCheckbox1Ref = useRef()
  const filterFromCheckbox2Ref = useRef()
  const filterFromCheckbox3Ref = useRef()

  // // data from backedn to be stored here
  const [backendData, setBackendData] = useState([])
  const [dataToChange, setDataToChange] = useState()

  // refs
  let [contentRow, setContentRow] = useState([])
  const [reloadTable, setReloadTable] = useState(false)

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      minWidth: '10rem',
    },
    {
      name: 'Role',
      selector: row => row.role,
      sortable: true,
    },
    {
      name: 'Company Email id',
      selector: row => row.companyEmail,
      grow: 2,
      minWidth: '15rem',
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    },
    {
      name: 'Contact',
      selector: row => row.contact,
      width: '130px',
    },
    {
      name: '',
      selector: row => row.edit,
      width: '80px',
    },
  ]

  useEffect(async () => {
    const payload = {
      pmk_admin: false,
      content_manager: true,
      user: true,
      filter: 'active',
    }
    const listuserdata = await API.post('admin/list_users', payload)
    var contentRowData = []
    listuserdata.data.map((data, index) => {
      contentRowData.push({
        name: data.first_name + ' ' + data.last_name,
        id: index,
        role: (
          <Dropdown
            value={data.role}
            data={dropdownData}
            addOrEditUser={addOrEditUser}
            userData={data}
          />
        ),
        companyEmail: data.email,
        status: data.status,
        contact: '8854636363',
        edit: (
          <div className="edit-icons" key={index}>
            <i
              className="fa-solid fa-pen-to-square"
              data={dropdownData}
              onClick={() => {
                setChangeModal('Edit')
                setOpenModal(true)
                setDataToChange(index)
              }}
            />
            <i
              className="fa-solid fa-trash"
              onClick={() => {
                // delete single user
                deleteSingleUser(data.email)
                setReloadTable(!reloadTable)
              }}
            />
          </div>
        ),
      })
    })
    setBackendData(listuserdata.data)
    setContentRow(contentRowData)
  }, [reloadTable, openModal])

  const conditionalRowStyles = [
    {
      when: row => row.id % 2 != 0,
      style: {
        backgroundColor: 'var(--bgColor2)',
      },
    },
  ]
  const customStyles = {
    rows: {
      style: {},
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
        color: 'var(--textColor3)',
        fontSize: '0.8rem',
      },
    },
  }

  // Useful Functions to manage Users from Table

  const saveAndExitModal = data => {
    console.log(data)
    if (data?.email && data) {
      addOrEditUser(data)
      setOpenModal(false)
    } else {
      setOpenModal(false)
    }
  }

  const selectedRowsAction = ({ selectedRows }) => {
    // do anything with selected rows
    console.log('do anything with', selectedRows)
    setSelectedRowsState(selectedRows)
  }

  const deleteUser = async () => {
    // write delete user api call here
    if (selectedRowsState.length > 0) {
      const deleteUserEmails = []
      console.log(selectedRowsState)
      selectedRowsState.map((row, index) => {
        deleteUserEmails.push(row.companyEmail)
      })
      const payload = {
        email: 'n.k@gx.ai',
      }
      console.log(payload)
      const afterDeleteMsg = await API.post('admin/delete_user', payload)
      console.log(afterDeleteMsg)
    }
    console.log('deleted Selected Users', selectedRowsState)
  }

  const deleteSingleUser = async userEmail => {
    const payload = {
      email: userEmail,
    }
    const afterDeleteMsg = await API.post('admin/delete_user', payload)
    toast.success(afterDeleteMsg.data.message)
    console.log(afterDeleteMsg)
  }

  const addOrEditUser = async data => {
    const payload = {
      email_id: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      role: data.role,
      password: 'Password.01',
    }
    if (payload.email_id != '') {
      const afterAddOrDeleteMsg = await API.post('admin/upsert_user', payload)
      toast.success(afterAddOrDeleteMsg.data.message)
    } else {
      toast.error('enter email')
    }
    setReloadTable(!reloadTable)
  }

  // filters
  const filterTable = (filterValue, field) => {
    const newRow = []
    backendData.map((data, index) => {
      if (data[field].toLowerCase() == filterValue.toLowerCase()) {
        newRow.push({
          name: data.first_name + ' ' + data.last_name,
          id: index,
          role: <Dropdown value={data.role} data={dropdownData} />,
          companyEmail: data.email,
          status: data.status,
          contact: '8854636363',
          edit: (
            <div className="edit-icons">
              <i
                className="fa-solid fa-pen-to-square"
                data={dropdownData}
                onClick={() => {
                  setChangeModal('Edit')
                  setOpenModal(true)
                  setDataToChange(index)
                }}
              />
              <i className="fa-solid fa-trash" />
            </div>
          ),
        })
      }
    })
    setContentRow(newRow)
  }

  const filterFromCheckbox = (checked, value) => {
    if (checked) {
      setFilterCheckbox(value)
      filterTable(value, 'role')
    } else {
      const newRow = []
      backendData.map((data, index) => {
        newRow.push({
          name: data.first_name + ' ' + data.last_name,
          id: index,
          role: <Dropdown value={data.role} data={dropdownData} />,
          companyEmail: data.email,
          status: data.status,
          contact: '8854636363',
          edit: (
            <div className="edit-icons">
              <i
                className="fa-solid fa-pen-to-square"
                data={dropdownData}
                onClick={() => {
                  setChangeModal('Edit')
                  setOpenModal(true)
                  setDataToChange(index)
                }}
              />
              <i className="fa-solid fa-trash" />
            </div>
          ),
        })
      })
      setContentRow(newRow)
    }
  }

  const filterFromStatus = value => {
    filterTable(value, 'status')
  }

  return (
    <div className="user-list-view">
      {openModal && (
        <UserDetailsModal
          DetailsModal
          data={backendData[dataToChange]}
          change={changeModal}
          saveAndExit={saveAndExitModal}
        />
      )}
      <SecondaryHeading title={'User list view'} />
      <div className="filter-actions">
        <div className="filter-icons">
          <i
            className="fa-solid fa-filter has-dropdown"
            onClick={() => {
              setShowFilterDropdown(!showFilterDropdown)
            }}
          />
          <div
            className="filter-dropdown dropdown"
            style={{
              display: showFilterDropdown ? 'flex' : 'none',
            }}
          >
            <span
              className="dropdown-element"
              ref={filter1Ref}
              onClick={() => {
                filterFromStatus(filter1Ref.current.innerText)
              }}
            >
              Active
            </span>
            <span
              className="dropdown-element"
              ref={filter2Ref}
              onClick={() => {
                filterFromStatus(filter2Ref.current.innerText)
              }}
            >
              Inactive
            </span>
            <span
              className="dropdown-element"
              ref={filter3Ref}
              onClick={() => {
                filterFromStatus(filter3Ref.current.innerText)
              }}
            >
              Internal User
            </span>
            <span
              className="dropdown-element"
              ref={filter4Ref}
              onClick={() => {
                filterFromStatus(filter4Ref.current.innerText)
              }}
            >
              External User
            </span>
          </div>
          <i
            className="fa-solid fa-trash"
            style={{ cursor: 'pointer' }}
            onClick={() => deleteUser()}
          />
        </div>
        <div className="filter-actions mgt">
          <div className="filter-checkbox">
            <input
              type="checkbox"
              ref={filterFromCheckbox1Ref}
              value="PMK Administrator"
              onChange={e => {
                filterFromCheckbox(e.target.checked, e.target.value)
              }}
            />
            PMK Administrator
          </div>
          <div className="filter-checkbox">
            <input
              type="checkbox"
              ref={filterFromCheckbox2Ref}
              value="Content Manager"
              onChange={e => {
                filterFromCheckbox(e.target.checked, e.target.value)
              }}
            />
            Content Manager
          </div>
          <div className="filter-checkbox">
            <input
              type="checkbox"
              ref={filterFromCheckbox3Ref}
              value="User"
              onChange={e => {
                filterFromCheckbox(e.target.checked, e.target.value)
              }}
            />{' '}
            User
          </div>
        </div>
      </div>
      <div className="user-list-view-table">
        <DataTable
          columns={columns}
          data={contentRow}
          selectableRows
          customStyles={customStyles}
          conditionalRowStyles={conditionalRowStyles}
          onSelectedRowsChange={selectedRowsAction}
        />

        <div
          className="add_row"
          onClick={() => {
            setChangeModal('Add')
            setOpenModal(true)
          }}
        >
          <i className="fa-solid fa-plus" /> Add
        </div>
      </div>
    </div>
  )
}

export default UserListView
