import React, { useRef, useState } from 'react'
import Header from '../../../components/Header'
import PrimaryHeading from '../../../components/Primary Headings'
import SecondaryHeading from '../../../components/Secondary Heading'
import DataTable, { createTheme } from 'react-data-table-component'
import './style.css'
import { Select } from 'antd'
import Dropdown from '../../../components/Dropdown'
import UserDetailsModal from '../../../components/Modals/User Detail Modal'

const UserListView = () => {
  // states
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [changeModal, setChangeModal] = useState('')
  const dropdownData = ['PMK Administrator', 'Content Manager', 'User']

  // refs

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

  const contentRow = [
    // while mapping the actual data use index of the array as id to style the rows in customRowStyles[]
    {
      id: '1',
      name: 'Yogesh Rajputh',
      role: <Dropdown value={'PMK Administrator'} data={dropdownData} />,
      companyEmail: 'yogeshrajput@yokogawa.com',
      status: 'Inactive',
      contact: '8854636363',
      edit: (
        <div className="edit-icons">
          <i
            className="fa-solid fa-pen-to-square"
            data={dropdownData}
            onClick={() => {
              setChangeModal('Edit')
              setOpenModal(true)
            }}
          />
          <i className="fa-solid fa-trash" />
        </div>
      ),
    },
    {
      id: '2',
      name: 'Yogesh Rajputh',
      role: <Dropdown value={'PMK Administrator'} data={dropdownData} />,
      companyEmail: 'yogeshrajput@yokogawa.com',
      status: 'Inactive',
      contact: '8854636363',
      edit: (
        <div className="edit-icons">
          <i className="fa-solid fa-pen-to-square" data={dropdownData} />
          <i className="fa-solid fa-trash" />
        </div>
      ),
    },
    {
      id: '3',
      name: 'Yogesh Rajputh',
      role: <Dropdown value={'PMK Administrator'} data={dropdownData} />,
      companyEmail: 'yogeshrajput@yokogawa.com',
      status: 'Inactive',
      contact: '8854636363',
      edit: (
        <div className="edit-icons">
          <i className="fa-solid fa-pen-to-square" />
          <i className="fa-solid fa-trash" />
        </div>
      ),
    },
    {
      id: '4',
      name: 'Yogesh Rajputh',
      role: <Dropdown value={'PMK Administrator'} data={dropdownData} />,
      companyEmail: 'yogeshrajput@yokogawa.com',
      status: 'Inactive',
      contact: '8854636363',
      edit: (
        <div className="edit-icons">
          <i className="fa-solid fa-pen-to-square" />
          <i className="fa-solid fa-trash" />
        </div>
      ),
    },
    {
      id: '5',
      name: 'Yogesh Rajputh',
      role: <Dropdown value={'PMK Administrator'} data={dropdownData} />,
      companyEmail: 'yogeshrajput@yokogawa.com',
      status: 'Inactive',
      contact: '8854636363',
      edit: (
        <div className="edit-icons">
          <i className="fa-solid fa-pen-to-square" />
          <i className="fa-solid fa-trash" />
        </div>
      ),
    },
  ]

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
    <>
      <div className="user-list-view">
        {openModal && <UserDetailsModal change={changeModal} saveAndExit={saveAndExitModal} />}
        <SecondaryHeading title={'User list view'} />
        {/* Filters and Actions */}
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
          {/* Add Row Option */}
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
    </>
  )
}

export default UserListView
