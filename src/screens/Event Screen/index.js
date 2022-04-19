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
      <div className="row mx-2 mx-md-5 h-100">
        <div className="col event-setting-container pb-5">
          <PrimaryHeading title={'RYC Event Calender'} backgroundImage={'yk-back-image-event'} />
        </div>
      </div>
      {eventList.length > 0 ? (
        <div className="calenderDiv" style={{ marginTop: '10px' }}>
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
                  <div>
                    <textarea className="eventPTag" disabled={true}>
                      {dataList[0].description}
                    </textarea>
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
              }}
            >
              <thead>
                <tr style={{ background: 'rgb(0, 79, 155)' }}>
                  <td colSpan="5" style={{ width: '10%' }}>
                    <div style={{ background: 'rgb(0, 79, 155)' }}>
                      <input
                        id="mainCheckbox"
                        type="checkbox"
                        style={{ margin: '5px', marginLeft: '25px' }}
                        onChange={event => handleMainCheckBox(event.target.checked)}
                      />
                      <label
                        style={{
                          color: 'white',
                          fontSize: '20px',
                          margin: '5px',
                        }}
                      >
                        Upcoming training
                      </label>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody
                style={{
                  display: 'block',
                  height: '450px',
                  overflow: 'auto',
                }}
              >
                {eventList.map(e => {
                  let startDate = moment(e.start_date, 'yyyy-MM-DD')
                  let endDate = moment(e.end_date, 'yyyy-MM-DD')
                  return (
                    <tr>
                      <td className="tdFirstAndLastWidth">
                        <div
                          style={{
                            padding: '25px',
                          }}
                        >
                          <input
                            type="checkbox"
                            id={e.id}
                            checked={checkedBoxState.filter(data => data.id == e.id)[0]?.status}
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
                        </div>
                      </td>
                      <td
                        style={{
                          width: '15%',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 'bold',
                            borderRight: '1px solid',
                          }}
                        >
                          <span> {moment(startDate).format('ddd DD MMM')}</span>
                          <br />
                          <span>{moment(endDate).format('ddd DD MMM')}</span>
                          <br />
                          <span>{endDate.diff(startDate, 'days')} days</span>
                        </div>
                      </td>
                      <td className="tdWidth">
                        <div
                          onClick={() => {
                            navigate('/event/update/' + e.id)
                          }}
                        >
                          <img
                            src="https://img.icons8.com/ios-filled/30/4a90e2/marker.png"
                            style={{
                              padding: '25px',
                            }}
                          />
                          {e.location}
                        </div>
                      </td>
                      <td className="tdWidth">
                        <div
                          style={{
                            padding: '25px',
                          }}
                        >
                          {e.description}
                        </div>
                      </td>
                      <td className="tdFirstAndLastWidth">
                        <div
                          style={{
                            padding: '25px',
                          }}
                        >
                          {getUserRoles() == 'Technical Administrator' ||
                          getUserRoles() == 'PMK Administrator' ? (
                            <img
                              src="https://img.icons8.com/ios-glyphs/30/fa314a/trash--v1.png"
                              onClick={() => {
                                openModal(e.id)
                              }}
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

          <div
            className="row"
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginLeft: '10%',
              marginBottom: '4%',
              marginRight: '10%',
            }}
          >
            <div>
              <button
                onClick={() => {
                  openModalForMultipleEvent()
                }}
                style={{
                  background: 'rgb(0, 79, 155)',
                  color: 'white',
                  border: '1px solid black',
                  borderRadius: '3px',
                  float: 'right',
                }}
              >
                Delete
              </button>
            </div>
            <div style={{ marginTop: '5%' }}>
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
            </div>
          </div>
          <br />
          <br />

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