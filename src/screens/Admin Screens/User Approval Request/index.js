import React, { useState, useEffect } from 'react'
import SecondaryHeading from '../../../components/Secondary Heading'
import DataTable from 'react-data-table-component'
import API from '../../../utils/api'
import AcceptRejectModal from '../../../components/Modals/AcceptRejectModal/acceptRejectModal'
import CreateNewDomain from '../../../components/Modals/Create Domian Modal/CreateDomainModal'
import DeleteDomainModal from '../../../components/Modals/DeleteDomainModal/DeleteDomainModal'
import { Pagination } from 'antd'
import { toast } from 'react-toastify'
import Example from '../../../components/Modals/Delete Modal/DeleteModal'
import Tooltip from '@mui/material/Tooltip'

const UserApprovalScreen = () => {
  const [show, setShow] = useState(false)
  const [openARModal, setOpenARModal] = useState(false)
  const [openDomainModal, setOpenDomainModal] = useState(false)
  const [openDeleteDomainModal, setOpenDeleteDomainModal] = useState(false)
  const [changeModal, setChangeModal] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const dropdownData = ['PMK Administrator', 'PMK Content Manager', 'User']
  const [rejectionData, setRejectionData] = useState()
  const [acceptData, setAcceptData] = useState()
  const [deleteDomainData, setDeleteDomainData] = useState()

  const [selectedRowsState, setSelectedRowsState] = useState([])
  const [selectedDULRowsState, setSelectedDULRowsState] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [pageNoCall, setPageNoCall] = useState(1)

  const [totalPageUserApproval, setTotalPageUserApproval] = useState(1)
  const [pageCallUserApproval, setPageCallUserApproval] = useState(1)

  const [selectedCheckBox, setSelectedCheckbox] = useState('')

  const onChangeUserApproval = number => {
    setPageCallUserApproval(number)
  }
  const [contentRowApprovalTable, setContentRowApprovalTable] = useState([])
  const [contentRowDomainUserListTable, setContentRowDomainUserListTable] = useState([])
  const [domainList, setDoaminList] = useState([])

  const [reloadTable, setReloadTable] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [DULfilter, setDULfilter] = useState(1)

  const changePositionInArr = (arr, indexFrom, idx) => {
    console.log(arr, indexFrom, idx)
    const element = arr.splice(indexFrom, 1)[0]
    arr.splice(idx, 0, element)
    return arr
  }

  const customSort = (rows, selector, direction) => {
    return rows.sort((a, b) => {
      // use the selector to resolve your field names by passing the sort comparitors
      const aField = selector(a).toLowerCase()
      const bField = selector(b).toLowerCase()

      let comparison = 0

      if (aField > bField) {
        comparison = 1
      } else if (aField < bField) {
        comparison = -1
      }
      return direction === 'desc' ? comparison * -1 : comparison
    })
  }

  useEffect(async () => {
    const listUserApprovalData = await API.post('admin/user_approval', {
      page_index: pageCallUserApproval,
    })
    setTotalPageUserApproval(listUserApprovalData.data.total_pages)
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
                <Tooltip title="Reject">
                  <i
                    role="button"
                    className="fa-solid fa-xmark reject"
                    onClick={() => {
                      // document.body.scrollTop = 0
                      // document.documentElement.scrollTop = 0
                      // document.body.style.overflow = 'hidden'
                      const sendData = {
                        email: data.email_id,
                        status: 'deactivate',
                      }
                      setRejectionData(sendData)
                      setChangeModal('Rejected')
                      setOpenARModal(true)
                      setModalTitle(data.request_for)
                    }}
                  />
                </Tooltip>
              </div>
              <div className="icon accept">
                <Tooltip title="Accept">
                  <i
                    role="button"
                    className="fa-solid fa-check"
                    onClick={() => {
                      // document.body.scrollTop = 0
                      // document.documentElement.scrollTop = 0
                      // document.body.style.overflow = 'hidden'
                      setAcceptData(data.email_id)
                      setChangeModal('Accepted')
                      setOpenARModal(true)
                      setModalTitle(data.request_for)
                    }}
                  />
                </Tooltip>
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
    let tempDL = []
    listDomains.data.map(data => {
      tempDL.push(data)
    })
    tempDL = changePositionInArr(
      tempDL,
      tempDL.findIndex(i => i.domain === 'www.yokogawa.com'),
      0
    )
    tempDL = changePositionInArr(
      tempDL,
      tempDL.findIndex(i => i.domain === 'UNK'),
      1
    )
    setContentRowApprovalTable(tempArr)
    setContentRowDomainUserListTable(tempDULArr)
    setDoaminList(tempDL)
    setIsLoading(false)
  }, [reloadTable, DULfilter /*, openDeleteDomainModal*/, pageNoCall, pageCallUserApproval])

  const rowDisabledCriteria = row => {
    return selectedCheckBox !== '' && row.type !== selectedCheckBox
  }

  const columnsApprovalTable = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      minWidth: '12rem',
    },
    {
      name: 'Date',
      selector: row => row.date,
      sortable: true,
      minWidth: '10rem',
    },
    {
      name: 'E-Mail ID',
      selector: row => row.email,
      grow: 2,
      minWidth: '12rem',
    },
    {
      name: 'New E-Mail ID',
      selector: row => row.new_email,
      grow: 2,
      minWidth: '12rem',
    },
    {
      name: 'Company',
      selector: row => row.company,
      minWidth: '10rem',
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
      minWidth: '12rem',
      sortable: true,
    },
    {
      name: 'Company E-Mail ID',
      selector: row => row.companyEmail,
      minWidth: '15rem',
    },
    {
      name: 'Status',
      selector: row => row.status,
      maxWidth: '8rem',
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
    console.log('Modal Closed')
    setOpenDeleteDomainModal(false)
    // document.body.style.overflow = 'auto'
  }

  const deleteAllDUL = async () => {
    if (selectedDULRowsState.length < 1) {
      toast.error('Please select the users to delete')
      return
    }
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
      toast.success(afterDeleteMsg.data.message)
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
      toast.success(afterAcceptMsg.data.message)
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
    // server is giving internal error
    const afterAcceptMsg = await API.post('admin/user_approval/approve', payload)
    toast.success(afterAcceptMsg.data.message)
    setChangeModal('Accepted')
    setModalTitle(null)
    setOpenARModal(false)
    console.log('accepted', data)
    setReloadTable(!reloadTable)
  }

  const deleteDomain = async data => {
    // admin/delete_whitelisted_domain
    const payload = {
      domain_id: [data.id],
      delete_associated_users: false,
    }
    const afterDeleteMsg = await API.post('admin/delete_whitelisted_domain', payload)
    toast.success(afterDeleteMsg.data.message)
    setReloadTable(!reloadTable)
  }

  const createDomain = async domain => {
    const payload = {
      domain_name: domain,
    }
    const afterCreateMsg = await API.post('admin/add_domain', payload)
    toast.success(afterCreateMsg.data.message)
    setReloadTable(!reloadTable)
  }

  const rejectSingleRequest = async (data, rejectText) => {
    if (rejectText) {
      const payload = {
        email_id: [data.email],
        status: changeModal == 'Accepted' ? 'activate' : 'deactivate',
        msg: rejectText,
      }
      // server is giving internal error
      const afterRejectMsg = await API.post('admin/user_approval/approve', payload)
      toast.success(afterRejectMsg.data.message)
      setReloadTable(!reloadTable)
    } else {
      setReloadTable(!reloadTable)
    }
  }

  const selectedRowsActionDUL = ({ selectedRows }) => {
    // do anything with selected rows
    setSelectedDULRowsState(selectedRows)
  }

  const getIsDeleteButtonDisabled = () => {
    return selectedDULRowsState.some(item => {
      return item.role === 'Technical Administrator'
    })
  }

  const selectedRowsActionUA = ({ selectedRows }) => {
    // do anything with selected rows
    if (selectedRows[0] !== undefined) {
      if (selectedRows[0].type !== selectedCheckBox) {
        setSelectedCheckbox(selectedRows[0].type)
      }
    } else {
      setSelectedCheckbox('')
    }
    setSelectedRowsState(selectedRows)
  }

  function onChange(pageNumber) {
    setPageNoCall(pageNumber)
  }

  return (
    <>
      {openARModal && (
        <AcceptRejectModal
          show={openARModal}
          title={modalTitle}
          change={changeModal}
          saveAndExit={saveAndExitModal}
          rejectSingleRequest={rejectSingleRequest}
          rejectionData={rejectionData}
          acceptData={acceptData}
          acceptSingleRequest={acceptSingleRequest}
        />
      )}
      {openDeleteDomainModal && (
        <DeleteDomainModal
          show={openDeleteDomainModal}
          saveAndExit={saveAndExitModal}
          deleteDomain={deleteDomain}
          data={deleteDomainData}
        />
      )}
      <div className="row mx-2 mx-lg-5 h-100">
        <div className="col user-approval-screen">
          <Example
            show={show}
            setShow={setShow}
            data={null}
            runDelete={() => {
              setShow(false)
              deleteAllDUL()
            }}
            req={'Attention'}
            title={'Are you sure you want to delete Users ?'}
            saveAndExit={() => setShow(false)}
          />

          <SecondaryHeading title={'User Approval Request'} />
          <div className="user-approval-request-table-contents">
            <div className="btn-container mb-2 row">
              <div className="col-auto">
                <button
                  style={{ cursor: selectedCheckBox !== 'approval' ? 'not-allowed' : '' }}
                  disabled={selectedCheckBox !== 'approval'}
                  className={`action-btn btn accept-request ${
                    selectedCheckBox !== 'approval' ? 'greyed' : null
                  }`}
                  onClick={() => {
                    if (selectedRowsState.length > 0) {
                      acceptAllRequest()
                    } else {
                      toast.error('Please select the user requests to accept')
                    }
                  }}
                >
                  Accept Request
                </button>
                <button
                  disabled={selectedCheckBox !== 'notification'}
                  className={`action-btn btn ${
                    selectedCheckBox !== 'notification' ? 'greyed' : null
                  }`}
                  onClick={() => {
                    API.get('admin/clear_notification')
                      .then(res => {
                        setReloadTable(!reloadTable)
                      })
                      .catch(err => {
                        setReloadTable(!reloadTable)
                      })
                  }}
                  style={{ cursor: selectedCheckBox !== 'notification' ? 'not-allowed' : '' }}
                >
                  Clear Notification
                </button>
              </div>
            </div>
            <div className="user-list-view-table aprroval-table mt-3">
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
                    sortIcon={
                      <Tooltip title="Sort">
                        <i className="fa-solid fa-sort ms-1"></i>
                      </Tooltip>
                    }
                    columns={columnsApprovalTable}
                    data={contentRowApprovalTable}
                    selectableRows
                    customStyles={customStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    onSelectedRowsChange={selectedRowsActionUA}
                    selectableRowDisabled={rowDisabledCriteria}
                    sortFunction={customSort}
                  />
                  <div className="pagination my-3">
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
          <div className="domain-user-list mt-4">
            <h2 className="h4">Domain User List</h2>
            <div>
              <div className="row">
                <div className="domain-list-content col-4">
                  <div className="domain-list">
                    {domainList.map((data, index) => (
                      <div
                        className="listed-domain"
                        style={{
                          backgroundColor: DULfilter == data.id ? 'var(--bgColor4)' : 'white',
                        }}
                        key={index}
                        onClick={() => {
                          setPageNoCall(1)
                          setDULfilter(data.id)
                        }}
                      >
                        <span className="d-flex flex-fill">{data.domain}</span>
                        <span className="mx-2">({data.count})</span>
                        {data.id != 1 && data.id != 2 ? (
                          <div>
                            <Tooltip title="Delete Domain">
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
                                  // document.body.scrollTop = 0
                                  // document.documentElement.scrollTop = 0
                                  // document.body.style.overflow = 'hidden'
                                  setDeleteDomainData(sendData)
                                  setOpenDeleteDomainModal(true)
                                }}
                              />
                            </Tooltip>
                            <i className="fa-solid fa-caret-right" />
                          </div>
                        ) : (
                          <div style={{ padding: '0px 1rem' }}></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn create-domain-btn"
                    onClick={() => {
                      // document.body.scrollTop = 0
                      // document.documentElement.scrollTop = 0
                      // document.body.style.overflow = 'hidden'
                      setOpenDomainModal(true)
                    }}
                  >
                    Add new domain
                  </button>
                </div>
                <div className="domain-user-table-content col-8">
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
                          sortIcon={<i className="fa-solid fa-sort ms-1"></i>}
                          columns={columnsDomainUserListTable}
                          data={contentRowDomainUserListTable}
                          selectableRows
                          customStyles={customStyles}
                          conditionalRowStyles={conditionalRowStyles}
                          onSelectedRowsChange={selectedRowsActionDUL}
                          sortFunction={customSort}
                        />
                        <div className="pagination my-3">
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
                  <div className="btn-container mt-2 row">
                    <div className="col-auto">
                      <button
                        disabled={getIsDeleteButtonDisabled()}
                        className={`action-btn-btn${getIsDeleteButtonDisabled() ? ' greyed' : ''}`}
                        onClick={() => {
                          if (selectedDULRowsState.length > 0) {
                            setShow(true)
                          } else {
                            toast.error('Please select the users to delete')
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
          </div>
        </div>
        {openDomainModal && (
          <CreateNewDomain
            show={openDomainModal}
            saveAndExit={saveAndExitModal}
            addDomain={createDomain}
          />
        )}
      </div>
    </>
  )
}

export default UserApprovalScreen
