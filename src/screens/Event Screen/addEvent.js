import React, { useEffect, useRef, useState } from 'react'
import Table from 'react-bootstrap/Table'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import 'react-datepicker/dist/react-datepicker.css'
import API from '../../utils/api'
import { getToken, getUserRoles, removeToken, removeUserRole } from '../../utils/token'
import { toast } from 'react-toastify'
import Header from '../../components/Header'
import './addEventStyle.css'
import image from '../Event Screen/assests/photo.png'
import Modal from 'react-modal'
import PrimaryHeading from '../../components/Event/PrimaryHeading'

const AddEventScreen = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [requirement, setRequirement] = useState([])
  const [endDate, setEndDate] = useState(new Date())
  const [disabled, setDisabled] = useState(false)
  const [eventOption, setEventOption] = useState({ value: 'site_event', label: 'Site Event' })
  const eventOptionList = [
    { value: 'site_event', label: 'Site Event' },
    { value: 'webinar', label: 'Webinar' },
  ]

  const classificationOption = [
    { value: 'internal_training', label: 'Internal Training' },
    { value: 'enternal_training', label: 'Enternal Training' },
  ]

  useEffect(async () => {
    let temp = []
    temp.push('min of 6 Months working for Yokogawa')
    temp.push('Fieldmate modem')
    temp.push('Travel Organisation')
    temp.push('optional visa if required')
    temp.push('XXX')
    temp.push('YYY')
    temp.push('Contact Rota Yokogawa for hotel reservation or assistance')
    setRequirement(temp)
  }, [])

  console.log('hello')
  return (
    <>
      <Header isLogedIn={getToken()} />
      <div className="event-screen-header">
        <PrimaryHeading title={'RYC Event Calender'} backgroundImage={'yk-back-image-profile'} />
      </div>

      <div
        style={{
          width: '100%',
          height: '100%',
          padding: '15px',
        }}
      >
        <div
          style={{
            boxShadow: '1px 0px 1px 1px #888888',
            width: '100%',
            height: '100%',
          }}
        >
          <h4 style={{ padding: '20px' }}>Rotomass TI Service Training</h4>
          <div
            style={{
              padding: '20px',
              width: '100%',
              display: 'flex',
            }}
          >
            <form style={{ alignItems: 'flex-start', width: '100%' }}>
              <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                <div className="col-md-8" style={{ display: 'flex' }}>
                  <label style={{ fontWeight: 'bold' }} className="col-md-4">
                    Start date
                  </label>
                  <DatePicker
                    minDate={new Date()}
                    className="col-md-3 form-control"
                    onChange={date => setStartDate(date)}
                    placeholderText="DDMMYYYY"
                    dateFormat="dd/M/Y"
                    selected={startDate}
                    style={{ width: '200px' }}
                  />
                  <div>
                    <i class="fa-solid fa-calendar-days" style={{ color: 'rgb(0, 79, 155)' }} />
                  </div>
                </div>
              </div>
              <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                <div className="col-md-8" style={{ display: 'flex' }}>
                  <label style={{ fontWeight: 'bold' }} className="col-md-4">
                    End date
                  </label>
                  <DatePicker
                    minDate={new Date()}
                    className="col-md-3 form-control"
                    onChange={date => setEndDate(date)}
                    placeholderText="DDMMYYYY"
                    dateFormat="dd/M/Y"
                    selected={endDate}
                    style={{ width: '200px' }}
                  />
                </div>
              </div>
              <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                <div className="col-md-8" style={{ display: 'flex' }}>
                  <label style={{ fontWeight: 'bold' }} className="col-md-4">
                    Duration
                  </label>
                  <input
                    type="number"
                    className="col-md-3 form-control"
                    style={{ width: '200px' }}
                  />
                </div>
              </div>
              <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                <div className="col-md-8" style={{ display: 'flex' }}>
                  <label style={{ fontWeight: 'bold' }} className="col-md-4">
                    Costs
                  </label>
                  <input
                    type="number"
                    className="col-md-3 form-control"
                    style={{ width: '200px' }}
                  />
                </div>
              </div>

              <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                <div className="col-md-8" style={{ display: 'flex' }}>
                  <label style={{ fontWeight: 'bold' }} className="col-md-4">
                    Location
                  </label>
                  <textarea rows="3" cols="30" className="form-control" />
                </div>
              </div>

              <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                <div className="col-md-8" style={{ display: 'flex' }}>
                  <label style={{ fontWeight: 'bold' }} className="col-md-4">
                    Type of Events
                  </label>
                  <Select
                    options={eventOptionList}
                    onChange={event => {
                      console.log(event.value)
                      if (event.value == 'webinar') {
                        setDisabled(true)
                      } else if (event.value == 'site_event') {
                        setDisabled(false)
                      }
                      let obj = eventOptionList.filter(e => e.value == event.value)[0]
                      console.log(obj)
                      setEventOption(obj)
                    }}
                    value={eventOption}
                  />
                  <button
                    onClick={() => {}}
                    style={{
                      background: 'rgb(0, 79, 155)',
                      color: 'white',
                      border: '1px solid black',
                      borderRadius: '3px',
                      fontSize: '13px',
                      marginLeft: '95px',
                    }}
                  >
                    Registered attendees list
                  </button>
                </div>
              </div>

              <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                <div
                  className="col-md-8"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }}>Max attendees</label>
                    <input
                      type="number"
                      className="form-control "
                      style={{ width: '70px', float: 'left', marginLeft: '80px' }}
                    />
                  </div>
                  <div style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }}>Remaining Seats</label>
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: '70px', float: 'left', marginLeft: '45px' }}
                    />
                  </div>
                </div>
              </div>

              <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                <div className="col-md-8" style={{ display: 'flex' }}>
                  <label style={{ fontWeight: 'bold' }} className="col-md-4">
                    Classification level
                  </label>
                  <Select options={classificationOption} />
                </div>
              </div>

              <div style={{ width: '100%', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '40%' }}>
                  <button
                    onClick={() => {}}
                    style={{
                      width: 'auto',
                      background: 'rgb(0, 79, 155)',
                      color: 'white',
                      border: '1px solid black',
                      borderRadius: '3px',
                      fontSize: '13px',
                      padding: '5px',
                    }}
                  >
                    Agenda
                  </button>
                  <button
                    onClick={() => {}}
                    style={{
                      width: 'auto',
                      background: 'rgb(0, 79, 155)',
                      color: 'white',
                      border: '1px solid black',
                      borderRadius: '3px',
                      fontSize: '13px',
                      padding: '5px',
                    }}
                  >
                    Other Possible link A
                  </button>
                  <button
                    onClick={() => {}}
                    style={{
                      width: 'auto',
                      background: 'rgb(0, 79, 155)',
                      color: 'white',
                      border: '1px solid black',
                      borderRadius: '3px',
                      fontSize: '13px',
                      padding: '5px',
                    }}
                  >
                    Other Possible Link B
                  </button>
                </div>
              </div>

              <div style={{ width: '100%', marginTop: '40px' }}>
                <h4>Requirements for the event</h4>
                {requirement.map(e => {
                  return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <li style={{ fontSize: '25px', color: 'rgb(0, 79, 155)' }}></li>
                      <h6>{e}</h6>
                    </div>
                  )
                })}

                <h6 style={{ marginLeft: '29px' }}>
                  <i style={{ color: 'rgb(0, 79, 155)' }} class="fa-solid fa-circle-plus" /> more
                </h6>

                <button
                  onClick={() => {}}
                  style={{
                    width: 'auto',
                    background: 'rgb(0, 79, 155)',
                    color: 'white',
                    border: '1px solid black',
                    borderRadius: '3px',
                    fontSize: '13px',
                    padding: '5px',
                    marginTop: '15px',
                  }}
                >
                  Publish
                </button>
              </div>
            </form>

            <div
              style={{
                border: '1px solid',
                width: '50%',
                height: '300px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img
                src={image}
                alt="not found"
                height="150px"
                width="150px"
                style={{ alignSelf: 'center' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          height: '100%',
          padding: '15px',
        }}
      >
        <div
          style={{
            boxShadow: '1px 0px 1px 1px #888888',
            width: '100%',
            height: '100%',
            padding: '15px',
          }}
        >
          <h4 style={{ padding: '20px' }}>Register for Trainings</h4>
          <div
            style={{
              padding: '20px',
              width: '100%',
              display: 'flex',
            }}
          >
            <form style={{ alignItems: 'flex-start', width: '100%' }}>
              <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                <div className="col-md-8" style={{ display: 'flex' }}>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="col-md-3 form-control"
                    style={{ width: '400px' }}
                  />
                </div>
              </div>
              <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                <div className="col-md-8" style={{ display: 'flex' }}>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="col-md-3 form-control"
                    style={{ width: '400px' }}
                  />
                </div>
              </div>

              <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                <div className="col-md-8" style={{ display: 'flex' }}>
                  <input
                    type="text"
                    placeholder="Company Email address"
                    className="col-md-3 form-control"
                    style={{ width: '400px' }}
                  />
                </div>
              </div>

              <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                <div className="col-md-8" style={{ display: 'flex' }}>
                  <input
                    type="text"
                    placeholder="Company "
                    className="col-md-3 form-control"
                    style={{ width: '400px' }}
                  />
                </div>
              </div>

              <div
                className="row"
                style={
                  disabled
                    ? { pointerEvents: 'none', opacity: '0.4', width: '100%', padding: '5px' }
                    : { width: '100%', padding: '5px' }
                }
              >
                <div className="col-md-8" style={{ marginTop: '20px' }}>
                  <label style={{ fontWeight: 'bold' }} className="col-md-4">
                    Hotel reservation required
                  </label>
                </div>
                <div className="row" style={{ width: '100%', display: 'inline' }}>
                  <div
                    className="col-md-3"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '6%',
                      marginTop: '10px',
                    }}
                  >
                    <input type="checkbox" className="col-md-4 form-check-input" id="yes" />
                    <label class="form-check-label" for="yes">
                      Yes
                    </label>
                  </div>
                  <div
                    className="col-md-3"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '6%',
                      marginTop: '10px',
                    }}
                  >
                    <input type="checkbox" className="col-md-4 form-check-input" id="no" />
                    <label class="form-check-label" for="no">
                      No
                    </label>
                  </div>
                </div>

                <div className="col-md-8" style={{ marginTop: '20px' }}>
                  <label style={{ fontWeight: 'bold' }} className="col-md-5">
                    Assist with organization of shuttle transport
                  </label>
                </div>
                <div className="row" style={{ width: '100%', display: 'inline' }}>
                  <div
                    className="col-md-3"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '6%',
                      marginTop: '10px',
                    }}
                  >
                    <input type="checkbox" className="col-md-4 form-check-input" id="yes" />
                    <label class="form-check-label" for="yes">
                      Yes
                    </label>
                  </div>
                  <div
                    className="col-md-3"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '6%',
                      marginTop: '10px',
                    }}
                  >
                    <input type="checkbox" className="col-md-4 form-check-input" id="no" />
                    <label class="form-check-label" for="no">
                      No
                    </label>
                  </div>
                </div>

                <div className="col-md-8" style={{ marginTop: '20px' }}>
                  <label style={{ fontWeight: 'bold' }} className="col-md-5">
                    Special food requirement
                  </label>
                </div>
                <div className="row" style={{ width: '100%', display: 'inline' }}>
                  <div
                    className="col-md-3"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '250px',
                      marginTop: '10px',
                    }}
                  >
                    <input type="checkbox" className="form-check-input" id="yes" />
                    <label class="form-check-label" for="yes">
                      No Special requirements
                    </label>
                  </div>
                  <div
                    className="col-md-3"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '115px',
                      marginTop: '10px',
                    }}
                  >
                    <input type="checkbox" className="col-md-4 form-check-input" id="no" />
                    <label class="form-check-label" for="no">
                      No Pork
                    </label>
                  </div>
                  <div
                    className="col-md-3"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '145px',
                      marginTop: '10px',
                    }}
                  >
                    <input type="checkbox" className="col-md-4 form-check-input" id="no" />
                    <label class="form-check-label" for="no">
                      Vegetarian
                    </label>
                  </div>
                  <div
                    className="col-md-3"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '740px',
                      marginTop: '10px',
                    }}
                  >
                    <input type="checkbox" className="form-check-input" id="no" />
                    <label class="form-check-label" for="no">
                      Other, please specify
                    </label>
                    <input type="text" className="form-control " style={{ width: '500px' }} />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="row">
            <div style={{ width: '80%', display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => {}}
                style={{
                  background: 'rgb(0, 79, 155)',
                  color: 'white',
                  border: '1px solid black',
                  borderRadius: '3px',
                  fontSize: '13px',
                  marginLeft: '30px',
                }}
              >
                Register
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '45%' }}>
                <label style={{ fontWeight: 'bold' }}>Registration can be cancelled untill</label>
                <DatePicker
                  minDate={new Date()}
                  className="col-md-3 form-control"
                  onChange={date => setEndDate(date)}
                  placeholderText="DDMMYYYY"
                  dateFormat="dd/M/Y"
                  selected={endDate}
                  style={{ width: '200px' }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginLeft: '30px', marginTop: '10px' }}>
            <label>By signing up, you agree with Terms of service and Privacy Policy</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddEventScreen
