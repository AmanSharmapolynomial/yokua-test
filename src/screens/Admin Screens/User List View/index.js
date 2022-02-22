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
const UserListView = () => {
  // states
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [changeModal, setChangeModal] = useState('')
  const dropdownData = ['PMK Administrator', 'Content Manager', 'User']

  // // data from backedn to be stored here
  const [backendData, setBackendData] = useState([])
  const [dataToChange, setDataToChange] = useState()
  // actions import
  useEffect(async () => {
    const payload = {
      pmk_admin: false,
      content_manager: true,
      user: true,
      filter: 'active',
    }
    console.log('fetchUserList')
    const data = await API.get('admin/list_users/', payload)
    console.log(data)
  }, [])

  // refs

  const contentRow = []

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

  // setBackendData([
  //   {
  //     first_name: 'Azhar',
  //     last_name: 'Malik',
  //     email: 'azhar@polynomial.ai',
  //     role: 'User',
  //     status: 'active',
  //     company_name: '',
  //   },
  //   {
  //     first_name: 'Prakhar',
  //     last_name: 'Kaushik',
  //     email: 'prakhar.k@polynomial.ao',
  //     role: 'PMK Administrator',
  //     status: 'active',
  //     company_name: '',
  //   },
  //   {
  //     first_name: 'naggu',
  //     last_name: 'gfc',
  //     email: 'n.k@gx.ai',
  //     role: 'User',
  //     status: 'active',
  //     company_name: '',
  //   },
  // ])
  let tempArr = [
    {
      first_name: 'Azhar',
      last_name: 'Malik',
      email: 'azhar@polynomial.ai',
      role: 'User',
      status: 'active',
      company_name: '',
    },
    {
      first_name: 'Prakhar',
      last_name: 'Kaushik',
      email: 'prakhar.k@polynomial.ao',
      role: 'PMK Administrator',
      status: 'active',
      company_name: '',
    },
    {
      first_name: 'naggu',
      last_name: 'gfc',
      email: 'n.k@gx.ai',
      role: 'User',
      status: 'active',
      company_name: '',
    },
  ]
  useEffect(() => {
    setBackendData(tempArr)
  }, [])

  backendData.map((data, index) => {
    contentRow.push({
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

  const saveAndExitModal = () => {
    setOpenModal(false)
  }

  return (
    <div className="user-list-view">
      {openModal && (
        <UserDetailsModal
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
            <span className="dropdown-element">Active</span>
            <span className="dropdown-element">Inactive</span>
            <span className="dropdown-element">Internal User</span>
            <span className="dropdown-element">External User</span>
          </div>
          <i className="fa-solid fa-trash" />
        </div>
        <div className="filter-actions">
          <div className="filter-checkbox">
            <input type="checkbox" value={'PMK Administrator'} /> PMK Administrator
          </div>
          <div className="filter-checkbox">
            <input type="checkbox" value={'Content Manager'} /> Content Manager
          </div>
          <div className="filter-checkbox">
            <input type="checkbox" value={'User'} /> User
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
