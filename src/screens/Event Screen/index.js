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
      <div className="row mx-2 mx-md-5 my-4 h-100">
        <div className="col event-setting-container">
          <PrimaryHeading title="RYG Event Calender" backgroundImage={'yk-back-image-event'} />
        </div>
      </div>
      {eventList.length > 0 ? (
        <div className="calenderDiv" style={{ margin: '10px 0' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Calendar
              //minDate={new Date()}
              formatShortWeekday={(locale, value) =>
                ['S', 'M', 'T', 'W', 'T', 'F', 'S'][value.getDay()]
              }
              tileContent={({ date, view }) => {
                let calenderDate = moment(date).format('yyyy-MM-DD').toString()
                //console.log(calenderDate)
                let dataList = eventList.filter(e => e.start_date === calenderDate)
                return dataList.length > 0 ? (
                  <div className="event-container">
                    {dataList.slice(0, 3).map(data => (
                      <div key={data.id} className="event-title">
                        {data.training_name}
                      </div>
                    ))}
                  </div>
                ) : null
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Table
              responsive="sm"
              style={{
                border: '1px solid',
                margin: '20px auto 0',
                maxHeight: '450px',
                width: '100%',
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
                        width: '15%',
                      }}
                    >
                      {isAdmin && (
                        <input
                          id="mainCheckbox"
                          type="checkbox"
                          style={{ marginLeft: '10px' }}
                          onChange={event => handleMainCheckBox(event.target.checked)}
                        />
                      )}
                      <p
                        style={{
                          color: 'white',
                          fontSize: '20px',
                          width: '100%',
                          marginBottom: 0,
                          marginLeft: '25px',
                        }}
                      >
                        All Trainings
                      </p>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                {eventList.map(e => {
                  let startDate = moment(e.start_date, 'yyyy-MM-DD')
                  let endDate = moment(e.end_date, 'yyyy-MM-DD')
                  return (
                    <tr>
                      <td style={{ width: '5%' }}>
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
                      <td style={{ width: '15%', minWidth: '150px' }}>
                        <div
                          style={{
                            borderRight: '1px solid',
                            paddingRight: '15px',
                            fontWeight: 'bold',
                          }}
                        >
                          <p>{moment(startDate).format('ddd DD MMM')}</p>
                          <p>{moment(endDate).format('ddd DD MMM')}</p>
                          <br />
                          <p>{endDate.diff(startDate, 'days')} days</p>
                        </div>
                      </td>
                      <td style={{ width: '30%' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <i
                            class="fas fa-location-dot"
                            aria-hidden="true"
                            style={{
                              color: '#004F9B',
                              fontSize: '1.5rem',
                              margin: '0 25px 0 10px',
                            }}
                          ></i>
                          <span style={{ fontWeight: 'bold' }}>
                            <p>{e.training_name}</p>
                            <p>{e.location}</p>
                            <p>{e.classification_level} Training</p>
                          </span>
                        </div>
                      </td>
                      <td style={{ width: '40%', minWidth: '120px' }}>
                        <div>
                          <label
                            style={{
                              color: '#004F9B',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              navigate('/event/update/' + e.id)
                            }}
                          >
                            Click here to Register Event
                          </label>
                        </div>
                      </td>
                      <td style={{ width: '30%', maxWidth: '300px' }}>
                        <p
                          style={{
                            padding: '25px',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                          }}
                        >
                          {e.description}
                        </p>
                      </td>
                      <td style={{ width: '5%' }}>
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
                })}
              </tbody>
            </Table>
          </div>

          {isAdmin && (
            <div className="row mx-2 mx-md-5 mb-5">
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
                      width: '75%',
                    }}
                    type="text"
                    maxLength="255"
                    placeholder="Maximum 255 character support..."
                    onChange={e => {
                      setEventDeleteMsg(e.target.value)
                    }}
                    className="form-control"
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
      ) : null}
    </>
  )
}

export default EventScreen
