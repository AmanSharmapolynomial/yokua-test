import React, { useEffect, useRef, useState } from 'react'
import SecondaryHeading from '../../../components/Secondary Heading'
import DataTable from 'react-data-table-component'
import { Pagination } from 'antd'
import API from '../../../utils/api'
import { toast } from 'react-toastify'
import { useLoading } from '../../../utils/LoadingContext'
import Modal from 'react-modal'
import axios from 'axios'
import CommonModal from '../../../components/Modals/CommonModal/CommonModal'

const customStyles = {
  headCells: {
    style: {
      paddingLeft: '16px', // override the cell padding for head cells
      paddingRight: '16px',
      backgroundColor: 'var(--bgColor2)',
      color: 'white',
    },
  },
  cells: {
    style: {
      paddingLeft: '16px', // override the cell padding for data cells
      paddingRight: '16px',
      fontSize: '0.8rem',
    },
  },
}

const customModalStyles = {
  overlay: {
    zIndex: 10,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    overflow: 'auto',
  },
}

let cancelToken

const EventManagement = () => {
  const { isLoading, setLoading } = useLoading()
  const [notificationTableData, setNotificationTableData] = useState([])
  const [notificationPage, setNotificationPage] = useState(1)
  const [notificationPagesTotal, setNotificationPagesTotal] = useState(1)
  const [notificationSelectedRows, setNotificationSelectedRows] = useState([])

  const [eventsList, setEventsList] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventAttendees, setEventAttendees] = useState([])
  const [eventAttendeesPage, setEventAttendeesPage] = useState(1)
  const [eventAttendeesPageTotal, setEventAttendeesPageTotal] = useState(1)

  const [isEventDataLoading, setIsEventDataLoading] = useState(false)

  const [isModalLoading, setIsModalLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState({})
  const [toggledClearRows, setToggleClearRows] = useState(true)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [rowToDelete, setRowToDelete] = useState(null)

  const columnsNotificationTable = [
    {
      name: 'SL.No',
      selector: row => row.id,
    },
    {
      name: 'Name',
      selector: row => row.full_name,
    },
    {
      name: 'E-Mail ID',
      selector: row => row.email,
      grow: 2,
    },
    {
      name: 'Event Name',
      selector: row => row.event_name,
    },
    {
      name: 'Date',
      selector: row => row.created_date,
    },
    {
      name: 'Change Preferences',
      selector: row => row.changed_preference,
      grow: 4,
    },
  ]

  const columnsEventDetails = [
    {
      name: 'Name',
      selector: row => row.name,
    },
    {
      name: 'E-Mail ID',
      selector: row => row.email_id,
    },
    {
      name: 'Register For',
      selector: row => row.registeredBy,
    },
    {
      name: 'Preferences',
      cell: row => (
        <button
          className="btn create-domain-btn py-1 px-2"
          onClick={() => {
            onClickViewPreferences(row.event_id, row.email_id)
          }}
        >
          View
        </button>
      ),
    },
    {
      name: 'Revoke',
      cell: row => (
        <button
          className="btn create-domain-btn py-1 px-2"
          onClick={() => {
            setRowToDelete(row)
            setConfirmModalOpen(true)
          }}
        >
          Remove
        </button>
      ),
    },
  ]

  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false)
  }

  const removeAttendee = async rowData => {
    const result = await API.post('/training/revoke_seat', {
      event_id: rowData.event_id,
      participant_email: rowData.email_id,
    })
    if (result.status === 200) {
      toast.success('User removed from the Event')
      setConfirmModalOpen(false)
      setRowToDelete(null)
      loadEventData()
    } else {
      toast.error('Error while removing user from the Event')
    }
  }

  const onClickViewPreferences = (event_id, email) => {
    setIsModalOpen(true)
    setIsModalLoading(true)
    API.post('/training/get_user_preference', {
      event_id,
      email,
    })
      .then(res => {
        if (res.status === 200) {
          setModalData(res.data)
        } else {
          toast.error(res.data?.message ?? 'Some error occurred')
        }
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setIsModalLoading(false)
      })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalData({})
  }

  const loadNotifications = () => {
    setLoading(true)
    API.post('training/get_preference_notification', {
      page_index: notificationPage,
    })
      .then(data => {
        setNotificationTableData(data.data.page_data)
        setNotificationPagesTotal(data.data.total_pages)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const loadEvents = () => {
    setLoading(true)
    API.get('training/training_list')
      .then(data => {
        setEventsList(data.data)
      })
      .finally(setLoading(false))
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
  const loadEventData = () => {
    if (selectedEvent) {
      if (cancelToken !== undefined) {
        cancelToken.cancel('Operation canceled by the user')
      }

      setIsEventDataLoading(true)
      cancelToken = axios.CancelToken.source()
      API.get(`training/training_registeration_view/${selectedEvent}`, {
        cancelToken: cancelToken.token,
      })
        .then(res => {
          if (res.status === 200) {
            setEventAttendeesPageTotal(eventAttendeesPage)
            setEventAttendees(res.data)
          }
        })
        .catch(err => {
          console.error(err)
        })
        .finally(() => {
          setIsEventDataLoading(false)
        })
    }
  }

  const handleRowSelected = React.useCallback(state => {
    setNotificationSelectedRows(state.selectedRows)
  }, [])

  const clearNotifications = () => {
    if (notificationSelectedRows.length > 0) {
      const id = notificationSelectedRows.map(row => row.id)
      API.post('/training/delete_preference_notification', {
        id,
      })
        .then(res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            setNotificationSelectedRows([])
            loadNotifications()
            setToggleClearRows(!toggledClearRows)
          } else {
            setNotificationSelectedRows([])
            loadNotifications()
            setToggleClearRows(!toggledClearRows)
            toast.error('Error: ', res.data.message)
          }
        })
        .catch(() => {
          setNotificationSelectedRows([])
          setToggleClearRows(!toggledClearRows)
          console.error('Error occurred')
        })
    }
  }

  useEffect(() => {
    loadNotifications()
    loadEvents()
  }, [])

  useEffect(() => {
    loadEventData()
  }, [selectedEvent])

  useEffect(() => {
    loadNotifications()
  }, [notificationPage])

  return (
    <>
      <div className="row mx-2 mx-lg-5 h-100">
        <div className="col user-approval-screen">
          <div className="secondary-heading h4 mt-4">
            <SecondaryHeading title={'Event Management'} />
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <SecondaryHeading title="Notification" />
            <button className="btn create-domain-btn" onClick={clearNotifications}>
              Clear Notifications
            </button>
          </div>
          <div>
            <div className="list-view-table mt-3">
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
                    sortIcon={<i className="fa-solid fa-sort ms-1"></i>}
                    columns={columnsNotificationTable}
                    data={notificationTableData}
                    selectableRows
                    customStyles={customStyles}
                    progressPending={isLoading}
                    onSelectedRowsChange={handleRowSelected}
                    fixedHeader
                    fixedHeaderScrollHeight="400px"
                    clearSelectedRows={toggledClearRows}
                    sortFunction={customSort}
                  />

                  <Pagination
                    key="userApproval"
                    current={notificationPage}
                    total={notificationPagesTotal * 10}
                    showQuickJumper
                    showSizeChanger={false}
                    onChange={newPage => {
                      setNotificationPage(newPage)
                    }}
                    style={{ border: 'none' }}
                  />
                </>
              )}
            </div>
          </div>
          <h2 className="col secondary-heading h4 mt-4">View Attendees List</h2>
          <div className="domain-user-list mt-4">
            <div>
              <div className="row">
                <div className="table-container col-3">
                  <table className="event-list-table">
                    <thead>
                      <tr>
                        <th>Event Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventsList.map(training => (
                        <tr key={training.id} onClick={() => setSelectedEvent(training.id)}>
                          <td className={training.id === selectedEvent ? 'active' : ''}>
                            <span>{training.training_name}</span>
                            <i className="fa fa-caret-right" aria-hidden="true"></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="domain-user-table-content col-9">
                  <div className="list-view-table">
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
                          columns={columnsEventDetails}
                          data={eventAttendees}
                          customStyles={customStyles}
                          fixedHeader
                          fixedHeaderScrollHeight="400px"
                          progressPending={isEventDataLoading}
                          sortFunction={customSort}
                        />
                        <Pagination
                          current={eventAttendeesPage}
                          key="trainingPage"
                          showQuickJumper
                          showSizeChanger={false}
                          total={eventAttendeesPageTotal}
                          onChange={num => {
                            setEventAttendeesPage(num)
                          }}
                          style={{ border: 'none' }}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          style={customModalStyles}
          onRequestClose={handleCloseModal}
          ariaHideApp={false}
        >
          <div style={{ position: 'relative' }}>
            <h3 className="text-center mb-3">View Preferences</h3>
            <i
              className="fa-solid fa-xmark"
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                padding: '3px 5px',
                borderRadius: '50%',
                background: '#cd0000',
                color: '#fff',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
              onClick={handleCloseModal}
            ></i>
            {isModalLoading ? (
              <h3>Loading...</h3>
            ) : (
              <form style={{ width: '100%' }}>
                <div className="row w-100">
                  <label style={{ fontWeight: 'bold' }}>Hotel reservation required</label>
                  <div className="row">
                    <div
                      className="row"
                      style={{
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={modalData?.hotel_reservation === true}
                        disabled
                      />
                      <label className="form-check-label" htmlFor="yes">
                        Yes
                      </label>
                    </div>
                    <div
                      className="row"
                      style={{
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={modalData?.hotel_reservation === false}
                        disabled
                      />
                      <label className="form-check-label" htmlFor="no">
                        No
                      </label>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>
                      Assist with organization of shuttle transport
                    </label>
                  </div>
                  <div className="row">
                    <div
                      className="row"
                      style={{
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={modalData?.shuttle_transport === true}
                        disabled
                      />
                      <label className="form-check-label" htmlFor="yes">
                        Yes
                      </label>
                    </div>
                    <div
                      className="row"
                      style={{
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={modalData?.shuttle_transport === false}
                        disabled
                      />
                      <label className="form-check-label" htmlFor="no">
                        No
                      </label>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>Special food requirement</label>
                  </div>
                  <div className="row">
                    <div
                      className="row"
                      style={{
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={modalData?.food_requirements === 'No Requirement'}
                        disabled
                      />
                      <label className="form-check-label" htmlFor="yes">
                        No Special requirements
                      </label>
                    </div>
                    <div
                      className="row"
                      style={{
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="col-lg-4 form-check-input"
                        checked={modalData?.food_requirements === 'No Pork'}
                        disabled
                      />
                      <label className="form-check-label" htmlFor="no">
                        No Pork
                      </label>
                    </div>
                    <div
                      className="row"
                      style={{
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="col-lg-4 form-check-input"
                        checked={modalData?.food_requirements === 'Vegetarian'}
                        disabled
                      />
                      <label className="form-check-label" htmlFor="no">
                        Vegetarian
                      </label>
                    </div>
                    <div
                      className="row"
                      style={{
                        position: 'relative',
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={
                          !(
                            modalData?.food_requirements === 'No Requirement' ||
                            modalData?.food_requirements === 'No Pork' ||
                            modalData?.food_requirements === 'Vegetarian'
                          )
                        }
                        disabled
                      />
                      <label className="form-check-label" htmlFor="no">
                        Other, please specify
                      </label>
                      {!(
                        modalData?.food_requirements === 'No Requirement' ||
                        modalData?.food_requirements === 'No Pork' ||
                        modalData?.food_requirements === 'Vegetarian'
                      ) && (
                        <input
                          type="text"
                          className="form-control"
                          value={modalData?.food_requirements}
                          disabled
                        />
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </Modal>
        <CommonModal
          action={'confirm'}
          show={confirmModalOpen}
          handleClose={null}
          modalTitle={'Remove User'}
          data={rowToDelete}
          handleDataChange={null}
          cancelAction={handleCloseConfirmModal}
          saveAction={removeAttendee}
          placeholder={''}
          ariaLabel={''}
        />
      </div>
    </>
  )
}

export default EventManagement
