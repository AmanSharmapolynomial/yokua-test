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
import SearchTable from '../../../components/SearchTable'
import { getUserRoles } from '../../../utils/token'
const UserListView = () => {
  // states
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [changeModal, setChangeModal] = useState('')
  const [filterCheckboxPMK, setFilterCheckboxPMK] = useState(true)
  const [filterCheckboxCM, setFilterCheckboxCM] = useState(true)
  const [filterCheckboxUser, setFilterCheckboxUser] = useState(true)
  const [filterActive, setFilterActive] = useState('')

  const [selectedRowsState, setSelectedRowsState] = useState([])
  const dropdownData = ['PMK Administrator', 'PMK Content Manager', 'User']

  const filter1Ref = useRef()
  const filter2Ref = useRef()
  const filterFromCheckbox1Ref = useRef()
  const filterFromCheckbox2Ref = useRef()
  const filterFromCheckbox3Ref = useRef()

  // // data from backedn to be stored here
  const [backendData, setBackendData] = useState([])
  const [dataToChange, setDataToChange] = useState()

  // refs
  let [contentRow, setContentRow] = useState([])
  const [reloadTable, setReloadTable] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      minWidth: '10rem',
    },
    {
      name: 'Permission Level',
      selector: row => row.role,
    },
    {
      name: 'Company Email id',
      selector: row => row.companyEmail,
      grow: 2,
      minWidth: '15rem',
    },
    {
      name: 'Company',
      selector: row => row.company,
      width: '130px',
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    },

    {
      name: '',
      selector: row => row.edit,
      width: '80px',
    },
  ]

  useEffect(() => {
    filterFromCheckbox1Ref.current.checked = true
    filterFromCheckbox2Ref.current.checked = true
    filterFromCheckbox3Ref.current.checked = true
  }, [])

  useEffect(async () => {
    setIsLoading(true)
    const payload = {
      pmk_admin: filterCheckboxPMK,
      content_manager: filterCheckboxCM,
      user: filterCheckboxUser,
      filter: filterActive,
    }
    const listuserdata = await API.post('admin/list_users', payload)

    const contentRowData = []
    listuserdata.data.map((data, index) => {
      contentRowData.push({
        name: (
          <span
            style={{
              cursor: 'pointer',
            }}
            onClick={() => {
              setChangeModal('View')
              setOpenModal(true)
              document.body.scrollTop = 0
              document.documentElement.scrollTop = 0
              document.body.style.overflow = 'hidden'
              setDataToChange(index)
            }}
          >
            {data.first_name + ' ' + data.last_name}
          </span>
        ),
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
        company: data.company_name,
        edit: (getUserRoles() == 'PMK Administrator' ||
          getUserRoles() == 'Technical Administrator') && (
          <div className="edit-icons" key={index}>
            <i
              className="fa-solid fa-pen-to-square"
              data={dropdownData}
              style={{
                color: 'var(--bgColor2)',
              }}
              onClick={() => {
                setChangeModal('Edit')
                setOpenModal(true)
                document.body.scrollTop = 0
                document.documentElement.scrollTop = 0
                document.body.style.overflow = 'hidden'
                setDataToChange(index)
              }}
            />
            <i
              className="fa-solid fa-trash"
              style={{
                color: '#CD2727',
              }}
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
    setIsLoading(false)
  }, [reloadTable, filterActive])

  const conditionalRowStyles = [
    {
      when: row => row.id % 2 != 0,
      style: {},
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
        backgroundColor: 'var(--bgColor2)',
        color: 'white',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',

        fontSize: '0.8rem',
      },
    },
  }

  // Useful Functions to manage Users from Table

  const saveAndExitModal = data => {
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
        email: deleteUserEmails,
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
  }

  const addOrEditUser = async data => {
    const payload = {
      email_id: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      role: data.role,
      password: data.password,
      company_name: data.company_name,
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
  const filterTable = value => {
    setFilterActive(value)
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
                if (filterActive == 'active') {
                  filterTable('')
                  filter1Ref.current.style.fontWeight = '300'
                } else {
                  filterTable('active')
                  filter1Ref.current.style.fontWeight = 'bold'
                  filter2Ref.current.style.fontWeight = '300'
                }
              }}
            >
              Active
            </span>
            <span
              className="dropdown-element"
              ref={filter2Ref}
              onClick={() => {
                if (filterActive == 'inactive') {
                  filterTable('')
                  filter2Ref.current.style.fontWeight = '300'
                } else {
                  filterTable('inactive')
                  filter2Ref.current.style.fontWeight = 'bold'
                  filter1Ref.current.style.fontWeight = '300'
                }
              }}
            >
              Inactive
            </span>
          </div>
          {getUserRoles() == 'PMK Administrator' && (
            <i
              className="fa-solid fa-trash"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                deleteUser()
                setReloadTable(!reloadTable)
              }}
            />
          )}
        </div>
        <div className="filter-actions mgt">
          <div className="filter-checkbox">
            <input
              type="checkbox"
              ref={filterFromCheckbox1Ref}
              value="PMK Administrator"
              onChange={e => {
                filterFromCheckbox(e.target.checked, e.target.value)
                if (e.target.checked) {
                  setFilterCheckboxPMK(true)
                  setReloadTable(!reloadTable)
                } else {
                  setFilterCheckboxPMK(false)
                  setReloadTable(!reloadTable)
                }
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
                if (e.target.checked) {
                  setFilterCheckboxCM(true)
                  setReloadTable(!reloadTable)
                } else {
                  setFilterCheckboxCM(false)
                  setReloadTable(!reloadTable)
                }
              }}
            />
            PMK Content Manager
          </div>
          <div className="filter-checkbox">
            <input
              type="checkbox"
              ref={filterFromCheckbox3Ref}
              value="User"
              onChange={e => {
                if (e.target.checked) {
                  setFilterCheckboxUser(true)
                  setReloadTable(!reloadTable)
                } else {
                  setFilterCheckboxUser(false)
                  setReloadTable(!reloadTable)
                }
              }}
            />{' '}
            User
          </div>
        </div>
      </div>
      <div className="user-list-view-table">
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5rem 0',
            }}
          >
            Loading...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={contentRow}
            selectableRows
            customStyles={customStyles}
            conditionalRowStyles={conditionalRowStyles}
            onSelectedRowsChange={selectedRowsAction}
          />
        )}

        {(getUserRoles() == 'PMK Administrator' || getUserRoles() == 'Technical Administrator') && (
          <div
            className="add_row"
            onClick={() => {
              setChangeModal('Add')
              setOpenModal(true)
            }}
          >
            <i
              className="fa-solid fa-plus"
              style={{
                backgroundColor: 'var(--bgColor2)',
              }}
            />{' '}
            Add
          </div>
        )}
      </div>
    </div>
  )
}

export default UserListView
