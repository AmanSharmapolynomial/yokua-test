import React, { useState, useEffect } from 'react'
import './style.css'

import UserDetailsModal from '../../../components/Modals/User Detail Modal'
import SecondaryHeading from '../../../components/Secondary Heading'
import Dropdown from '../../../components/Dropdown'
import DataTable from 'react-data-table-component'
import ResetPasswordModal from '../../../components/Modals/Reset Password Modal'
import API from '../../../utils/api'
import AcceptRejectModal from '../../../components/Modals/AcceptRejectModal/acceptRejectModal'

const UserApprovalScreen = () => {
  const [openARModal, setOpenARModal] = useState(false)
  const [changeModal, setChangeModal] = useState('')
  const dropdownData = ['PMK Administrator', 'Content Manager', 'User']

  const [selectedRowsState, setSelectedRowsState] = useState([])
  const [selectedDULRowsState, setSelectedDULRowsState] = useState([])

  // useEffect(async () => {
  //   console.log('fetchUserList')
  //   const data = await API.get('admin/user_approval')
  //   console.log(data)
  // }, [])

  // refs
  const backendData = [
    {
      name: 'Prakhar Kaushik',
      date: '2022-02-20',
      email_id: 'prakhar.k@polynomial.ao',
      company: '',
      request_for: 'New User Registeration',
      type: 'notification',
    },
  ]

  const backendDomainData = [
    {
      id: 1,
      domain: 'www.yokogawa.com',
      count: 3,
    },
    {
      id: 2,
      domain: 'www.polynomial.ai',
      count: 2,
    },
    {
      id: 3,
      domain: 'UNK',
      count: 1,
    },
    {
      id: 4,
      domain: 'xyz.com',
      count: 0,
    },
  ]

  const backendDULData = [
    {
      name: 'Prakhar Kaushik',
      email_id: 'prakhar.k@polynomial.ao',
      role: 'PMK Administrator',
      status: 'active',
    },
    {
      name: 'Prakhar Kaushik',
      email_id: 'prakhar.k@polynomial.ai',
      role: 'PMK Administrator',
      status: 'active',
    },
  ]

  const [contentRowApprovalTable, setContentRowApprovalTable] = useState([])
  const [contentRowDomainUserListTable, setContentRowDomainUserListTable] = useState([])
  const [domainList, setDoaminList] = useState([])

  useEffect(() => {
    const tempArr = []
    backendData.map((data, index) => {
      tempArr.push({
        id: index,
        name: data.name,
        date: data.date,
        email: data.email_id,
        company: data.company,
        requestFor: data.request_for,
        edit: (
          <div className="edit-icons">
            <div className="icon reject">
              <i
                className="fa-solid fa-xmark reject"
                onClick={() => {
                  rejectSingleRequest({
                    email_id: data.email_id,
                    status: 'deactivate',
                  })
                }}
              />
            </div>
            <div className="icon accept">
              <i
                className="fa-solid fa-check"
                onClick={() => {
                  acceptSingleRequest({
                    email_id: data.email_id,
                    status: 'activate',
                  })
                }}
              />
            </div>
          </div>
        ),
      })
    })
    const tempDULArr = []
    backendDULData.map((data, index) => {
      tempDULArr.push({
        id: index,
        name: data.name,
        role: data.role,
        companyEmail: data.email_id,
        company: 'Yokogawa',
        status: data.status,
      })
    })
    const tempDL = []
    backendDomainData.map(data => {
      tempDL.push(data)
    })
    setContentRowApprovalTable(tempArr)
    setContentRowDomainUserListTable(tempDULArr)
    setDoaminList(tempDL)
  }, [])

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

  const conditionalRowStyles = [
    {
      when: row => row.id % 2 == 0,
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
    setOpenARModal(false)
  }

  const deleteAllDUL = () => {
    const dataArray = []
    selectedDULRowsState.map(row => {
      let rowDataObj = {}
      rowDataObj['email_id'] = row.email
      dataArray.push(rowDataObj)
    })
    // send this data or call the api here to delete all selected DULs
    if (dataArray.length > 0) {
      console.log('delete')
    } else return
  }

  const acceptAllRequest = () => {
    const dataArray = []
    selectedRowsState.map(row => {
      let rowDataObj = {}
      rowDataObj['email_id'] = row.email
      rowDataObj['status'] = 'activate'
      dataArray.push(rowDataObj)
    })
    // send this data or call the api here to accept all request
    if (dataArray.length > 0) {
      console.log('accept all selected request')
    } else return
  }

  const acceptSingleRequest = data => {
    // call accept req api here
    setChangeModal('Accepted')
    setOpenARModal(true)
    console.log('accepted', data)
  }

  const [rejectMsg, setRejectMsg] = useState()
  const rejectSingleRequest = data => {
    setChangeModal('Rejected')
    setOpenARModal(true)
    console.log('rejected', data)
    // call reject request api here if(msg.length > 0)
  }

  const selectedRowsActionDUL = ({ selectedRows }) => {
    // do anything with selected rows
    setSelectedDULRowsState(selectedRows)
  }

  const selectedRowsActionUA = ({ selectedRows }) => {
    // do anything with selected rows
    setSelectedRowsState(selectedRows)
  }

  return (
    <div className="user-approval-screen">
      {openARModal && (
        <AcceptRejectModal
          change={changeModal}
          saveAndExit={saveAndExitModal}
          setRejectMsg={setRejectMsg}
        />
      )}
      <SecondaryHeading title={'User Approval Request'} />
      <div className="user-approval-request-table-contents">
        <div className="btn-container">
          <button
            className="action-btn btn"
            onClick={() => {
              if (selectedRowsState.length > 0) {
                acceptAllRequest()
              }
            }}
          >
            Accept Request
          </button>
        </div>
        <div className="user-list-view-table aprroval-table">
          <DataTable
            columns={columnsApprovalTable}
            data={contentRowApprovalTable}
            selectableRows
            customStyles={customStyles}
            conditionalRowStyles={conditionalRowStyles}
            onSelectedRowsChange={selectedRowsActionUA}
          />
        </div>
      </div>
      <div className="domain-user-list">
        <h3>Domain User List</h3>
        <div className="domain-user-list-content">
          <div className="domain-list-content">
            <div className="domain-list">
              {domainList.map((data, index) => (
                <div className="listed-domain" key={index}>
                  <span className="domain-text">{data.domain}</span>
                  <span className="domain-value">({data.count})</span>
                  <i className="fa-solid fa-trash" />
                </div>
              ))}
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
                onSelectedRowsChange={selectedRowsActionDUL}
              />
            </div>
            <div className="btn-container">
              <button
                className="action-btn btn"
                onClick={() => {
                  if (selectedDULRowsState.length > 0) {
                    deleteAllDUL()
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserApprovalScreen
