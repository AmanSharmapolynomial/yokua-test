import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Table from 'react-bootstrap/Table'
import PrimaryHeading from '../../components/Primary Headings'
import API from '../../utils/api'
import { getToken, getUserRoles, removeToken, removeUserRole } from '../../utils/token'
import { toast } from 'react-toastify'
import Header from '../../components/Header'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './style.css'
import Modal from 'react-modal'

const moment = require('moment')

const EventScreen = () => {
  const navigate = useNavigate()
  //const [value, onChangse] = useState(new Date())
  //for handling check box feature, and delete one or more event
  const [checkedBoxState, setCheckedBoxState] = useState([])
  const [mainCheckedBoxState, setMainCheckedBoxState] = useState([])
  const [reloadData, setReloadData] = useState(false)
  //for event list
  const [eventList, setEventList] = useState([])
  //to acheive delete feture
  const [eventIdList, setEventIdList] = useState([])
  const [eventDeleteMsg, setEventDeleteMsg] = useState([])
  const [modalIsOpen, setIsOpen] = useState(false)

  const isAdmin =
    getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'

  useEffect(async () => {
    getAllEventList()
  }, [])

  //console.log(eventList)
  //console.log(checkedBoxState)

  const getAllEventList = async () => {
    let temp = []
    const listOfEventList = await API.get('training/training_list')
    listOfEventList.data.map(e => {
      temp.push({
        id: e.id,
        status: false,
      })
    })
    setCheckedBoxState([...temp])
    setEventList(listOfEventList.data)
  }
  function openModal(id) {
    setIsOpen(true)
    let temp = [...checkedBoxState]
    checkedBoxState.forEach(e => {
      if (e.id == id) {
        e.status = !e.status
      }
    })
    setCheckedBoxState([...temp])
  }

  function openModalForMultipleEvent() {
    setIsOpen(true)
    //setCheckedBoxState(checkedBoxState[id] == true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '32%',
    },
  }

  //handle single event delete
  const handleDeleteEvent = async () => {
    let temp = []
    let toKeepRecord = []
    checkedBoxState.forEach(e => {
      if (e.status == true) temp.push(e.id)
      else toKeepRecord.push(e)
    })

    //remove all the event
    const payloadName = {
      event_id: temp,
      msg: eventDeleteMsg,
    }
    const afterUpdateMsg = await API.post('/training/trainging_deletion', payloadName)
    toast.success(afterUpdateMsg.data.message)
    closeModal()
    getAllEventList()
    //setCheckedBoxState([...toKeepRecord])
  }

  //handle main check box
  const handleMainCheckBox = value => {
    let temp = []
    //console.log(value)

    checkedBoxState.map(e => {
      temp.push({
        id: e.id,
        status: value,
      })
    })
    //console.log(temp)
    setCheckedBoxState([...temp])
  }
  //delete model

  //console.log(getUserRoles())
  //if (reloadData == true) {
  return (
    <>
      <Header isLogedIn={getToken()} />
      <div className="row mx-2 mx-lg-5 my-4 h-100">
        <div className="col-12 center py-lg-3">
          <PrimaryHeading title="RYG Event Calendar" backgroundImage={'yk-back-image-event'} />
        </div>
        <div className="col-12">
          <Calendar
            //minDate={new Date()}
            prevLabel={<i className="fas fa-caret-left"></i>}
            nextLabel={<i className="fas fa-caret-right"></i>}
            formatShortWeekday={(locale, value) =>
              ['S', 'M', 'T', 'W', 'T', 'F', 'S'][value.getDay()]
            }
            tileContent={({ date, view }) => {
              const calenderDate = Date.parse(moment(date).format('yyyy-MM-DD')).toString().trim()
              // let calenderDate = moment(date).format('yyyy-MM-DD')
              let dataList = eventList.filter(e => {
                const startDate = Date.parse(e.start_date).toString().trim()
                const endDate = Date.parse(e.end_date).toString().trim()
                return (
                  // startDate === calenderDate ||
                  // endDate === calenderDate ||
                  (startDate <= calenderDate && endDate > calenderDate) ||
                  (startDate === calenderDate && endDate === calenderDate)
                )
              })
              return dataList.length > 0 ? (
                <div className="event-container">
                  {dataList.slice(0, 3).map(data => (
                    <div
                      key={data.id}
                      className="event-title d-none d-lg-block"
                      onClick={() => {
                        window.scrollTo(0, 0)
                        navigate('/event/update/' + data.id)
                      }}
                    >
                      {data.training_name} - {data.duration}
                    </div>
                  ))}
                  <i class="bi bi-dot event-dot d-block d-lg-none"></i>
                </div>
              ) : null
            }}
          />

          <div className="mt-2 w-100" style={{ display: 'flex', justifyContent: 'center' }}>
            <Table
              responsive="md"
              style={{
                display: 'block',
                overflowX: 'auto',
                border: '1px solid',
              }}
            >
              <thead>
                <tr style={{ background: 'rgb(0, 79, 155)' }}>
                  <td colSpan="6">
                    <div
                      style={{
                        background: 'rgb(0, 79, 155)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '5px 0',
                      }}
                    >
                      {isAdmin && (
                        <input
                          className="d-none d-lg-block me-3"
                          id="mainCheckbox"
                          type="checkbox"
                          style={{ marginLeft: '10px' }}
                          onChange={event => handleMainCheckBox(event.target.checked)}
                        />
                      )}
                      <p
                        style={{
                          color: 'white',
                          fontSize: '1rem',
                          width: '100%',
                          marginBottom: 0,
                        }}
                      >
                        {isAdmin ? 'All Trainings' : 'Upcoming Trainings'}
                      </p>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                {eventList.length > 0 ? (
                  eventList.map(e => {
                    let startDate = moment(e.start_date, 'yyyy-MM-DD')
                    let endDate = moment(e.end_date, 'yyyy-MM-DD')
                    return (
                      <tr>
                        <td className="col-auto d-none d-lg-table-cell">
                          <div>
                            {isAdmin && (
                              <input
                                type="checkbox"
                                id={e.id}
                                checked={checkedBoxState.filter(data => data.id == e.id)[0]?.status}
                                style={{ marginLeft: '10px' }}
                                onChange={event => {
                                  let temp = [...checkedBoxState]
                                  temp.forEach(data => {
                                    if (data.id == e.id) {
                                      data.status = !data.status
                                    }
                                  })
                                  setCheckedBoxState([...temp])
                                }}
                              />
                            )}
                          </div>
                        </td>
                        <td className="col-lg-2">
                          <div
                            className="date-container"
                            style={{
                              borderRight: '1px solid',
                              fontWeight: 'bold',
                            }}
                          >
                            <p>{moment(startDate).format('ddd DD MMM')}</p>
                            <p>{moment(endDate).format('ddd DD MMM')}</p>
                            <br />
                            <p>
                              {endDate.diff(startDate, 'days') !== 0
                                ? endDate.diff(startDate, 'days') + ' days'
                                : 1 + ' day'}
                            </p>
                          </div>
                        </td>
                        <td className="col-lg-2">
                          <div
                            className="location-container"
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <i
                              className="fas fa-location-dot"
                              aria-hidden="true"
                              style={{
                                color: '#004F9B',
                                margin: '0 25px 0 10px',
                              }}
                            ></i>
                            <span style={{ fontWeight: 'bold' }}>
                              <p style={{ marginBottom: '10px' }}>{e.training_name}</p>
                              <p style={{ marginBottom: '10px' }}>{e.location}</p>
                              <p>{e.classification_level} Training</p>
                            </span>
                          </div>
                        </td>
                        <td className="col-lg-2">
                          <div className="register-container">
                            <label
                              style={{
                                color: '#004F9B',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                window.scrollTo(0, 0)
                                navigate('/event/update/' + e.id)
                              }}
                            >
                              Click here to Register Event
                            </label>
                          </div>
                        </td>
                        <td className="col-lg-6">
                          <p
                            className="desc-container"
                            style={{
                              wordBreak: 'break-all',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              maxHeight: '6rem',
                              overflowY: 'auto',
                            }}
                          >
                            {e.description}
                          </p>
                        </td>
                        <td className="col-auto d-none d-lg-table-cell">
                          <div
                            style={{
                              padding: '25px',
                            }}
                          >
                            {getUserRoles() == 'Technical Administrator' ||
                            getUserRoles() == 'PMK Administrator' ? (
                              <i
                                className="fas fa-trash"
                                onClick={() => {
                                  openModal(e.id)
                                }}
                                style={{ fontSize: '1.15rem', cursor: 'pointer', color: '#cd2727' }}
                              />
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <div className="text-center">No Events Found</div>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {isAdmin && (
            <div className="row mb-5 d-none d-lg-flex">
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => {
                    navigate('/event/add')
                  }}
                  style={{
                    background: 'rgb(0, 79, 155)',
                    color: 'white',
                    border: '1px solid black',
                    borderRadius: '3px',
                  }}
                >
                  RYG Event creation
                </button>
                <button
                  onClick={() => {
                    openModalForMultipleEvent()
                  }}
                  style={{
                    background: 'rgb(0, 79, 155)',
                    color: 'white',
                    border: '1px solid black',
                    borderRadius: '3px',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
          <div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
              <div>
                <p
                  style={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  Event Cancellation
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  className="row"
                >
                  <input
                    style={{
                      borderRadius: '3px',
                    }}
                    type="text"
                    maxLength="255"
                    placeholder="Maximum 255 character support..."
                    onChange={e => {
                      setEventDeleteMsg(e.target.value)
                    }}
                    className="form-control w-100"
                    required
                  />
                </div>
                <br />
                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    style={{
                      background: 'white',
                      color: 'rgb(0, 79, 155)',
                      border: '1px solid black',
                      borderRadius: '3px',
                    }}
                    onClick={() => {
                      closeModal()
                    }}
                  >
                    Cancel
                  </button>
                  &nbsp;&nbsp;
                  <button
                    onClick={() => {
                      handleDeleteEvent()
                    }}
                    style={{
                      background: 'rgb(0, 79, 155)',
                      color: 'white',
                      border: '1px solid black',
                      borderRadius: '3px',
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  )
}

export default EventScreen
