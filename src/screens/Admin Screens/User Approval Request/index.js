import React, { useState } from 'react'
import './style.css'

import UserDetailsModal from '../../../components/Modals/User Detail Modal'
import SecondaryHeading from '../../../components/Secondary Heading'
import Dropdown from '../../../components/Dropdown'
import DataTable from 'react-data-table-component'
import ResetPasswordModal from '../../../components/Modals/Reset Password Modal'

const UserApprovalScreen = () => {
  const [openModal, setOpenModal] = useState(false)
  const [changeModal, setChangeModal] = useState('')
  const dropdownData = ['PMK Administrator', 'Content Manager', 'User']

  // refs

  const columnsApprovalTable = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      minWidth: '10rem',
    },
    {
      name: 'Date',
      selector: row => row.date,
      sortable: true,
    },
    {
      name: 'Email id',
      selector: row => row.email,
      grow: 2,
      minWidth: '15rem',
    },
    {
      name: 'Company',
      selector: row => row.company,
    },
    {
      name: 'Request for',
      selector: row => row.requestFor,
      width: '150px',
    },
    {
      name: '',
      selector: row => row.edit,
      width: '80px',
    },
  ]

  const contentRowApprovalTable = [
    // while mapping the actual data use index of the array as id to style the rows in customRowStyles[]
    {
      id: '1',
      name: 'Yogesh Rajputh',
      date: '12-02-2022',
      role: <Dropdown value={'PMK Administrator'} data={dropdownData} />,
      email: 'yogeshrajput@yokogawa.com',
      company: 'Yokogawa',
      requestFor: 'Email id change',
      edit: (
        <div className="edit-icons">
          <div className="icon reject">
            <i
              className="fa-solid fa-xmark reject"
              data={dropdownData}
              onClick={() => {
                setChangeModal('Edit')
                setOpenModal(true)
              }}
            />
          </div>
          <div className="icon accept">
            <i className="fa-solid fa-check" />
          </div>
        </div>
      ),
    },
    {
      id: '2',
      name: 'Yogesh Rajputh',
      date: '12-02-2022',
      role: <Dropdown value={'PMK Administrator'} data={dropdownData} />,
      email: 'yogeshrajput@yokogawa.com',
      company: 'Yokogawa',
      requestFor: 'Email id change',
      edit: (
        <div className="edit-icons">
          <div className="icon reject">
            <i
              className="fa-solid fa-xmark reject"
              data={dropdownData}
              onClick={() => {
                setChangeModal('Edit')
                setOpenModal(true)
              }}
            />
          </div>
          <div className="icon accept">
            <i className="fa-solid fa-check" />
          </div>
        </div>
      ),
    },
    {
      id: '3',
      name: 'Yogesh Rajputh',
      date: '12-02-2022',
      role: <Dropdown value={'PMK Administrator'} data={dropdownData} />,
      email: 'yogeshrajput@yokogawa.com',
      company: 'Yokogawa',
      requestFor: 'Email id change',
      edit: (
        <div className="edit-icons">
          <div className="icon reject">
            <i
              className="fa-solid fa-xmark reject"
              data={dropdownData}
              onClick={() => {
                setChangeModal('Edit')
                setOpenModal(true)
              }}
            />
          </div>
          <div className="icon accept">
            <i className="fa-solid fa-check" />
          </div>
        </div>
      ),
    },
    {
      id: '4',
      name: 'Yogesh Rajputh',
      date: '12-02-2022',
      role: <Dropdown value={'PMK Administrator'} data={dropdownData} />,
      email: 'yogeshrajput@yokogawa.com',
      company: 'Yokogawa',
      requestFor: 'Email id change',
      edit: (
        <div className="edit-icons">
          <div className="icon reject">
            <i
              className="fa-solid fa-xmark reject"
              data={dropdownData}
              onClick={() => {
                setChangeModal('Edit')
                setOpenModal(true)
              }}
            />
          </div>
          <div className="icon accept">
            <i className="fa-solid fa-check" />
          </div>
        </div>
      ),
    },
  ]

  const columnsDomainUserListTable = [
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
      name: 'status',
      selector: row => row.status,
    },
  ]

  const contentRowDomainUserListTable = [
    // while mapping the actual data use index of the array as id to style the rows in customRowStyles[]
    {
      id: '1',
      name: 'Yogesh Rajputh',
      role: 'PMK Administrator',
      companyEmail: 'yogeshrajput@yokogawa.com',
      company: 'Yokogawa',
      status: 'Active',
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
    <div className="user-approval-screen">
      {' '}
      {openModal && <ResetPasswordModal change={changeModal} saveAndExit={saveAndExitModal} />}
      <SecondaryHeading title={'User Approval Request'} />
      <div className="user-approval-request-table-contents">
        <div className="btn-container">
          <button className="action-btn btn">Accept Request</button>
        </div>
        <div className="user-list-view-table aprroval-table">
          <DataTable
            columns={columnsApprovalTable}
            data={contentRowApprovalTable}
            selectableRows
            customStyles={customStyles}
            conditionalRowStyles={conditionalRowStyles}
          />
        </div>
      </div>
      <div className="domain-user-list">
        <h3>Domain User List</h3>
        <div className="domain-user-list-content">
          <div className="domain-list-content">
            <div className="domain-list">
              <div className="listed-domain">
                <span className="domain-text">Yokogawa.com</span>
                <span className="domain-value">(50)</span>
                <i className="fa-solid fa-trash" />
              </div>
              <div className="listed-domain">
                <span className="domain-text">Yokogawa.com</span>
                <span className="domain-value">(50)</span>
                <i className="fa-solid fa-trash" />
              </div>
              <div className="listed-domain">
                <span className="domain-text">Yokogawa.com</span>
                <span className="domain-value">(50)</span>
                <i className="fa-solid fa-trash" />
              </div>
            </div>
            <button className="btn create-domain-btn">Create new domain</button>
          </div>
          <div className="domain-user-table-content">
            <div className="user-list-view-table">
              <DataTable
                columns={columnsDomainUserListTable}
                data={contentRowDomainUserListTable}
                selectableRows
                customStyles={customStyles}
                conditionalRowStyles={conditionalRowStyles}
              />
            </div>
            <div className="btn-container">
              <button className="action-btn btn">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserApprovalScreen
