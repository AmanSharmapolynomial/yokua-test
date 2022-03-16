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
import { useStoreState } from 'easy-peasy'
import DeleteDomainModal from '../../../components/Modals/DeleteDomainModal/DeleteDomainModal'
import { Pagination } from 'antd'
import { useDetectClickOutside } from 'react-detect-click-outside'

const UserApprovalScreen = () => {
  const [openARModal, setOpenARModal] = useState(false)
  const [openDomainModal, setOpenDomainModal] = useState(false)
  const [openDeleteDomainModal, setOpenDeleteDomainModal] = useState(false)
  const [changeModal, setChangeModal] = useState('')
  const dropdownData = ['PMK Administrator', 'Content Manager', 'User']
  const [rejectMsg, setRejectMsg] = useState()
  const [rejectionData, setRejectionData] = useState()
  const [acceptData, setAcceptData] = useState()
  const [deleteDomainData, setDeleteDomainData] = useState()

  const [selectedRowsState, setSelectedRowsState] = useState([])
  const [selectedDULRowsState, setSelectedDULRowsState] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [pageNoCall, setPageNoCall] = useState(1)

  const [totalPageUserApproval, setTotalPageUserApproval] = useState(1)
  const [pageCallUserApproval, setPageCallUserApproval] = useState(1)

  const onChangeUserApproval = number => {
    setPageCallUserApproval(number)
  }

  // /admin/user_approval

  // refs

  const [contentRowApprovalTable, setContentRowApprovalTable] = useState([])
  const [contentRowDomainUserListTable, setContentRowDomainUserListTable] = useState([])
  const [domainList, setDoaminList] = useState([])

  const [reloadTable, setReloadTable] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [DULfilter, setDULfilter] = useState(1)

  const [pageIndex, setPageIndex] = useState({ page_index: 1 })

  useEffect(async () => {
    const listUserApprovalData = await API.post('admin/user_approval', {
      page_index: pageCallUserApproval,
    })
    setTotalPageUserApproval(listUserApprovalData.data.total_pages)
    console.log(listUserApprovalData)
    setIsLoading(true)
    const tempArr = []
    listUserApprovalData.data.page_data.map((data, index) => {
      tempArr.push({
        id: index,
        name: data.name,
        date: data.date,
        email: data.email_id,
        new_email: data.new_email,
        company: data.company,
        requestFor: data.request_for,
        type: data.type,
        edit:
          data.type == 'approval' ? (
            <div className="edit-icons">
              <div className="icon reject">
                <i
                  className="fa-solid fa-xmark reject"
                  onClick={() => {
                    document.body.scrollTop = 0
                    document.documentElement.scrollTop = 0
                    document.body.style.overflow = 'hidden'
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
                    document.body.scrollTop = 0
                    document.documentElement.scrollTop = 0
                    document.body.style.overflow = 'hidden'
                    setAcceptData(data.email_id)
                    setChangeModal('Accepted')
                    setOpenARModal(true)
                  }}
                />
              </div>
            </div>
          ) : (
            ''
          ),
      })
    })

    const payloadDUL = {
      page_index: pageNoCall,
    }

    const listDULdata = await API.post(`admin/list_whitelisted_domain/${DULfilter}`, payloadDUL)
    const tempDULArr = []
    listDULdata.data.page_data.map((data, index) => {
      tempDULArr.push({
        id: index,
        name: data.name,
        role: data.role,
        companyEmail: data.email_id,
        company: 'Yokogawa',
        status: data.status,
      })
    })
    setTotalPages(listDULdata.data.total_pages)

    const listDomains = await API.get('admin/list_whitelisted_domain')
    const tempDL = []
    listDomains.data.map(data => {
      tempDL.push(data)
    })

    setContentRowApprovalTable(tempArr)
    setContentRowDomainUserListTable(tempDULArr)
    setDoaminList(tempDL)
    setIsLoading(false)
  }, [reloadTable, DULfilter, openARModal, openDeleteDomainModal, pageNoCall, pageCallUserApproval])

  const rowDisabledCriteria = row => row.type == 'notification'

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
      name: 'E-Mail id',
      selector: row => row.email,
      grow: 2,
      minWidth: '15rem',
    },
    {
      name: 'New E-mail id',
      selecter: row => row.new_email,
      grow: 2,
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
    setOpenDeleteDomainModal(false)
    document.body.style.overflow = 'scroll'
  }

  const deleteAllDUL = async () => {
    const dataArray = []
    selectedDULRowsState.map(row => {
      dataArray.push(row.companyEmail)
    })
    // send this data or call the api here to delete all selected DULs
    if (selectedDULRowsState.length > 0) {
      const payload = {
        email: dataArray,
      }
      // not working issue from the backend - tell them to make api accept an email Array
      const afterDeleteMsg = await API.post('admin/delete_user', payload)
      console.log(afterDeleteMsg)
      setReloadTable(!reloadTable)
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
        email_id: dataArray,
        status: 'activate',
        msg: 'Accepted Your Request',
      }
      console.log(payload)
      // server is giving internal error
      const afterAcceptMsg = await API.post('admin/user_approval/approve', payload)
      console.log(afterAcceptMsg)
      setReloadTable(!reloadTable)
    } else return
  }

  const acceptSingleRequest = async data => {
    // call accept req api here
    const payload = {
      email_id: [data],
      status: 'activate',
      msg: 'Accepted Your Request',
    }
    console.log(payload)
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
      delete_associated_users: 'false',
    }
    const afterDeleteMsg = await API.post('admin/delete_whitelisted_domain', payload)
    // toast.success(afterDeleteMsg.data.message)
    setReloadTable(!reloadTable)
  }

  const createDomain = domain => {
    const payload = {
      domain_name: domain,
    }
    const afterCreateMsg = API.post('admin/add_domain', payload)
    console.log(afterCreateMsg)
    setReloadTable(!reloadTable)
  }

  const rejectSingleRequest = async data => {
    if (rejectMsg) {
      const payload = {
        email_id: [data.email],
        status: changeModal == 'Accepted' ? 'activate' : 'deactivate',
        msg: rejectMsg,
      }
      // server is giving internal error
      const afterRejectMsg = await API.post('admin/user_approval/approve', payload)
      console.log(afterRejectMsg.data)
      setReloadTable(!reloadTable)
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

  function onChange(pageNumber) {
    setPageNoCall(pageNumber)
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
          acceptData={acceptData}
          acceptSingleRequest={acceptSingleRequest}
        />
      )}

      {openDomainModal && (
        <CreateNewDomain saveAndExit={saveAndExitModal} addDomain={createDomain} />
      )}

      {openDeleteDomainModal && (
        <DeleteDomainModal
          saveAndExit={saveAndExitModal}
          deleteDomain={deleteDomain}
          data={deleteDomainData}
        />
      )}
      <SecondaryHeading title={'User Approval Request'} />
      <div className="user-approval-request-table-contents">
        <div className="btn-container mb-2 ">
          <button
            className="action-btn btn clear-notification"
            onClick={() => {
              const a = API.get('admin/clear_notification')
              console.log(a)
              setReloadTable(!reloadTable)
            }}
          >
            Clear Notification
          </button>
          <button
            className="action-btn btn "
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
            <>
              <DataTable
                columns={columnsApprovalTable}
                data={contentRowApprovalTable}
                selectableRows
                customStyles={customStyles}
                conditionalRowStyles={conditionalRowStyles}
                onSelectedRowsChange={selectedRowsActionUA}
                selectableRowDisabled={rowDisabledCriteria}
              />
              <div className="pagination">
                <Pagination
                  current={pageCallUserApproval}
                  key={'userApproval'}
                  total={totalPageUserApproval * 10}
                  showQuickJumper
                  showSizeChanger={false}
                  onChange={onChangeUserApproval}
                  style={{ border: 'none' }}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="domain-user-list">
        <h3>Domain User List</h3>
        <div className="domain-user-list-content">
          <div className="domain-list-content">
            <div
              className="domain-list"
              style={{
                maxHeight: '27rem',
              }}
            >
              {domainList.map((data, index) => (
                <div
                  className="listed-domain"
                  style={{
                    backgroundColor: DULfilter == data.id ? 'var(--bgColor4)' : 'white',
                  }}
                  key={index}
                  onClick={() => {
                    setDULfilter(data.id)
                  }}
                >
                  <span className="domain-text">{data.domain}</span>
                  <span className="domain-value">({data.count})</span>
                 <div>
                    <i
                      className="fa-solid fa-trash"
                      style={{
                        cursor: 'pointer',
                        color: '#CD2727',
                      }}
                      onClick={() => {
                        // admin/delete_whitelisted_domain
                        const sendData = {
                          id: data.id,
                          name: data.domain,
                          associated_users: 'false',
                        }
                        document.body.scrollTop = 0
                        document.documentElement.scrollTop = 0
                        document.body.style.overflow = 'hidden'
                        setDeleteDomainData(sendData)
                        setOpenDeleteDomainModal(true)
                      }}
                    />

                    <i className='fa-solid fa-caret-right'/>
                    </div>


                    
                  
                </div>
              ))}
            </div>
            <button
              className="btn create-domain-btn"
              onClick={() => {
                document.body.scrollTop = 0
                document.documentElement.scrollTop = 0
                document.body.style.overflow = 'hidden'
                setOpenDomainModal(true)
              }}
            >
              Create new domain
            </button>
          </div>
          <div className="domain-user-table-content">
            <div className="user-list-view-table">
              {isLoading ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Loading...
                </div>
              ) : (
                <>
                  <DataTable
                    columns={columnsDomainUserListTable}
                    data={contentRowDomainUserListTable}
                    selectableRows
                    customStyles={customStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    onSelectedRowsChange={selectedRowsActionDUL}
                  />
                  <div className="pagination">
                    <Pagination
                      current={pageNoCall}
                      key={'domainUser'}
                      showQuickJumper
                      showSizeChanger={false}
                      total={totalPages * 10}
                      onChange={onChange}
                      style={{ border: 'none' }}
                    />
                  </div>
                </>
              )}
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
