import React, { useState, useEffect } from 'react'
import './style.css'

import UserDetailsModal from '../../../components/Modals/User Detail Modal'
import SecondaryHeading from '../../../components/Secondary Heading'
import Dropdown from '../../../components/Dropdown'
import DataTable from 'react-data-table-component'
import ResetPasswordModal from '../../../components/Modals/Reset Password Modal'
import API from '../../../utils/api'
import AcceptRejectModal from '../../../components/Modals/AcceptRejectModal/acceptRejectModal'
import CreateNewDomain from '../../../components/Modals/Create Domian Modal/CreateDomainModal'
import { toast } from 'react-toastify'

const UserApprovalScreen = () => {
  const [openARModal, setOpenARModal] = useState(false)
  const [openDomainModal, setOpenDomainModal] = useState(false)
  const [changeModal, setChangeModal] = useState('')
  const dropdownData = ['PMK Administrator', 'Content Manager', 'User']
  const [rejectMsg, setRejectMsg] = useState()
  const [rejectionData, setRejectionData] = useState()
  const [isLoading, setLoading] = useState(false)

  const [selectedRowsState, setSelectedRowsState] = useState([])
  const [selectedDULRowsState, setSelectedDULRowsState] = useState([])

  // /admin/user_approval

  // refs

  const [contentRowApprovalTable, setContentRowApprovalTable] = useState([])
  const [contentRowDomainUserListTable, setContentRowDomainUserListTable] = useState([])
  const [domainList, setDoaminList] = useState([])

  const [reloadTable, setReloadTable] = useState(false)

  useEffect(async () => {
    const listUserApprovalData = await API.get('admin/user_approval')

    const tempArr = []
    listUserApprovalData.data.map((data, index) => {
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
                  const sendData = {
                    email: data.email_id,
                    status: 'deactivate',
                  }
                  setRejectionData(sendData)
                  setChangeModal('Rejected')
                  setOpenARModal(true)
                }}
              />
            </div>
            <div className="icon accept">
              <i
                className="fa-solid fa-check"
                onClick={() => {
                  acceptSingleRequest(data.email_id)
                }}
              />
            </div>
          </div>
        ),
      })
    })
    const listDULdata = await API.get('admin/list_whitelisted_domain/2')
    const tempDULArr = []
    listDULdata.data.map((data, index) => {
      tempDULArr.push({
        id: index,
        name: data.name,
        role: data.role,
        companyEmail: data.email_id,
        company: 'Yokogawa',
        status: data.status,
      })
    })
    const listDomains = await API.get('admin/list_whitelisted_domain')
    const tempDL = []
    listDomains.data.map(data => {
      tempDL.push(data)
    })
    setContentRowApprovalTable(tempArr)
    setContentRowDomainUserListTable(tempDULArr)
    setDoaminList(tempDL)
  }, [reloadTable, domainList])

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

  const saveAndExitModal = () => {
    setOpenARModal(false)
    setOpenDomainModal(false)
  }

  const deleteAllDUL = async () => {
    const dataArray = []
    selectedDULRowsState.map(row => {
      dataArray.push(row.companyEmail)
    })
    // send this data or call the api here to delete all selected DULs
    if (selectedDULRowsState.length > 0) {
      setLoading(true)
      const payload = {
        email: dataArray,
      }
      // not working issue from the backend - tell them to make api accept an email Array
      const afterDeleteMsg = await API.post('admin/delete_user', payload)
      console.log(afterDeleteMsg)
      setReloadTable(!reloadTable)
      setLoading(false)
    } else return
  }

  const acceptAllRequest = async () => {
    const dataArray = []
    selectedRowsState.map(row => {
      dataArray.push(row.email)
    })
    // send this data or call the api here to accept all request
    if (selectedRowsActionUA.length > 0) {
      const payload = {
        email_id: dataArray[0],
        status: 'activate',
        msg: 'Accepted Your Request',
      }
      // server is giving internal error
      const afterAcceptMsg = await API.post('admin/user_approval/approve', payload)
      console.log(afterAcceptMsg)
    } else return
  }

  const acceptSingleRequest = async data => {
    // call accept req api here
    const payload = {
      email_id: [data],
      status: 'activate',
      msg: 'Accepted Your Request',
    }
    // server is giving internal error
    const afterAcceptMsg = await API.post('admin/user_approval/approve', payload)
    console.log(afterAcceptMsg)
    setChangeModal('Accepted')
    setOpenARModal(true)
    console.log('accepted', data)
  }

  const deleteDomain = async data => {
    // admin/delete_whitelisted_domain
    const payload = {
      domain_id: [data.id],
      delete_associated_users: data.associated_users,
    }
    const afterDeleteMsg = await API.post('admin/delete_whitelisted_domain', payload)
    toast.success(afterDeleteMsg.data.message)
  }

  const createDomain = domain => {
    const payload = {
      domain_name: domain,
    }
    const afterCreateMsg = API.post('admin/add_domain', payload)
    console.log(afterCreateMsg)
  }

  const rejectSingleRequest = async data => {
    if (rejectMsg) {
      const payload = {
        email_id: [data.email],
        status: data.status,
        msg: rejectMsg,
      }
      // server is giving internal error
      const afterRejectMsg = await API.post('admin/user_approval/approve', payload)
      console.log(afterRejectMsg.data)
    }
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
          rejectSingleRequest={rejectSingleRequest}
          rejectionData={rejectionData}
        />
      )}

      {openDomainModal && (
        <CreateNewDomain saveAndExit={saveAndExitModal} addDomain={createDomain} />
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
                  <i
                    className="fa-solid fa-trash"
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      // admin/delete_whitelisted_domain
                      const sendData = {
                        id: data.id,
                        associated_users: 'true',
                      }
                      deleteDomain(sendData)
                    }}
                  />
                </div>
              ))}
            </div>
            <button
              className="btn create-domain-btn"
              onClick={() => {
                setOpenDomainModal(true)
              }}
            >
              Create new domain
            </button>
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
                disabled={isLoading}
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
