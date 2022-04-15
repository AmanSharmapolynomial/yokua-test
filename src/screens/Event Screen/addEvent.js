import React, { useEffect, useRef, useState } from 'react'
import Table from 'react-bootstrap/Table'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
const moment = require('moment')
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import 'react-datepicker/dist/react-datepicker.css'
import API from '../../utils/api'
import { getToken, getUserRoles, removeToken, removeUserRole } from '../../utils/token'
import Header from '../../components/Header'
import './addEventStyle.css'
import image from '../../assets/Icon feather-image.png'
import Modal from 'react-modal'
import CustomeModel from '../../components/Event Module/Modal'
import PrimaryHeading from '../../components/Primary Headings'
import CloseIcon from '../../assets/close_modal.png'
import { max } from 'moment'

const AddEventScreen = () => {
  const navigate = useNavigate()
  //create event state varible
  const [trainingName, setTrainingName] = useState('')
  const [location, setLocation] = useState('')
  const [duration, setDuration] = useState('')
  const [cost, setCost] = useState('')
  const [maxAttendacees, setMaxAttendeed] = useState(0)
  const [remainSeat, setRemainSeats] = useState(0)
  const [description, setDescription] = useState('')
  const [trainingFormDisable, setTrainingFormDisable] = useState(false)

  //register in event state variable
  const [userProfile, setUserProfile] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [hotelReservation, setHotelReservation] = useState('')
  const [shuttleTransport, setShuttleTransport] = useState('')
  const [foodRequirement, setFoodRequirement] = useState('')
  const [foodRequirementList, setFoodRequirementList] = useState([])
  const [otherFoodRequirement, setOtherFoodRequirement] = useState('')
  const [termsPolicy, setTermPolicy] = useState(false)

  //feature state varible
  const { eventId } = useParams()
  //console.log(eventId)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [cancelledDate, setCancelledDate] = useState(new Date())
  const [eventDetailById, setEventDetailById] = useState({})
  const [singleRequirement, setSingleRequirement] = useState('')
  const [requirement, setRequirement] = useState([])
  const [disabled, setDisabled] = useState(false)
  const [isStartDateOpen, setIsStartDateOpen] = useState(false)
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)
  const [modalIsOpen, setIsOpen] = useState(false)
  const [moreInputFlag, setMoreInputFlag] = useState(true)
  const [agendaMessage, setAgendaMessage] = useState('')
  const [alinkMessage, setAlinkMessage] = useState('')
  const [blinkMessage, setBlinkMessage] = useState('')
  const [dependOnButton, setDependOnButton] = useState('')
  const [linkModal, setLinkModal] = useState(false)
  const [registeredAttendeesListModalOpen, setRegisteredAttendeesListModalOpen] = useState(false)
  const [registeredAttendeesList, setRegisteredAttendeesList] = useState([])

  const [classificationLevel, setClassificationLevel] = useState({
    value: 'internal',
    label: 'Internal Training',
  })
  const [registerationType, setRegistrationType] = useState(
    getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'
      ? {
          value: 'internal',
          label: 'My self',
        }
      : { value: 'external', label: 'External' }
  )
  const [eventOption, setEventOption] = useState({
    value: 'site event',
    label: 'Site Event',
  })
  const eventOptionList = [
    { value: 'site event', label: 'Site Event' },
    { value: 'webinar', label: 'Webinar' },
  ]
  const registerationTypeOption = [
    { value: 'internal', label: 'My self' },
    { value: 'external', label: 'External' },
  ]

  const classificationOption = [
    { value: 'internal', label: 'Internal Training' },
    { value: 'external', label: 'External Training' },
  ]

  useEffect(async () => {
    let temp = []
    // temp.push('min of 6 Months working for Yokogawa')
    // temp.push('Fieldmate modem')
    // temp.push('Travel Organisation')
    // temp.push('optional visa if required')
    // temp.push('Contact Rota Yokogawa for hotel reservation or assistance')

    setRequirement(temp)
    if (eventId != null) {
      getEventDetailById(eventId)
      //get Current User profile from token
      getUserProfile()
      setTrainingFormDisable(true)
    }
  }, [])

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
  const customStyles2 = {
    content: {
      top: '60%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '60%',
      height: '60%',
    },
  }
  const getUserProfile = async () => {
    await API.get('auth/profile_settings/')
      .then(async data => {
        //toast.success('')
        if (data.status == 200 || data.status == 201) {
          const result = data.data
          //console.log(result)
          setUserProfile(result)
          if (
            getUserRoles() == 'Technical Administrator' ||
            getUserRoles() == 'PMK Administrator'
          ) {
            setFirstName(result['basic_profile'].full_name)
            setCompanyEmail(result['basic_profile'].email)
            setCompanyName(result['basic_profile'].company_name)
          }
        } else {
          toast.error('Error while getting record')
          navigate('/event/all')
        }
        //setReloadData(true)
      })
      .catch(error => {
        toast.error('Error while getting record')
        navigate('/event/all')
      })
  }
  const getEventDetailById = async id => {
    await API.get('training/training_view/' + id)
      .then(async data => {
        //toast.success('')
        if (data.status == 200 || data.status == 201) {
          const result = data.data
          setEventDetailById(result)
          //console.log(result)
          setTrainingName(result.event_details['training_name'])
          setStartDate(new Date(result.event_details['start_date']))
          setEndDate(new Date(result.event_details['end_date']))
          setCancelledDate(new Date(result.event_details['cancelled_date']))
          setDescription(result.event_details['description'])
          setLocation(result.event_details['location'])
          setMaxAttendeed(result.event_details['max_attendees'])
          setRemainSeats(result.event_details['remaining_seats'])
          setDuration(
            moment(new Date(result.event_details['end_date'])).diff(
              new Date(result.event_details['start_date']),
              'days'
            )
          )
          setClassificationLevel(
            classificationOption.find(e => e.value == result.event_details['classification_level'])
          )
          setCost(result.event_details['cost'])
          setAgendaMessage(result.links['agenda_link'])
          setAlinkMessage(result.links['link_a'])
          setBlinkMessage(result.links['link_b'])
          setRequirement(result.requirements)

          //call for get registered attendees
          await getRegisteredAttendeesForEventByEventId(eventId)
        } else {
          toast.error('Error while getting record')
          navigate('/event/all')
        }
        //setReloadData(true)
      })
      .catch(error => {
        toast.error('Error while getting record')
        navigate('/event/all')
      })
  }

  const getRegisteredAttendeesForEventByEventId = async eventId => {
    await API.get('training/training_registeration_view/' + eventId)
      .then(async data => {
        //toast.success('')
        if (data.status == 200 || data.status == 201) {
          const result = data.data
          setRegisteredAttendeesList(result)
          //console.log(result)
        } else {
          toast.error('Error while getting record')
          navigate('/event/all')
        }
        //setReloadData(true)
      })
      .catch(error => {
        toast.error('Error while getting record')
        navigate('/event/all')
      })
  }

  const openModal = e => {
    e.preventDefault()
    setIsOpen(true)
  }
  const closeModal = () => {
    setIsOpen(false)
    setLinkModal(false)
  }

  //handle publish event
  const handlePublishButton = async event => {
    event.preventDefault()
    const eventObject = {
      event_details: {
        cost: cost,
        max_attendees: maxAttendacees,
        remaining_seats: remainSeat,
        event_type: eventOption.value,
        location: location,
        classification_level: classificationLevel.value,
        start_date: moment(startDate).format('YYYY-MM-DD'),
        end_date: moment(endDate).format('YYYY-MM-DD'),
        cancelled_date: moment(cancelledDate).format('YYYY-MM-DD'),
        description: description,
        training_name: trainingName,
      },
      links: {
        agenda_link: agendaMessage,
        link_a: alinkMessage,
        link_b: blinkMessage,
      },
      requirements: requirement,
    }

    //console.log('called api: ' + JSON.stringify(eventObject))
    await API.post('training/training_addition', eventObject)
      .then(data => {
        if (data.status == 200 || data.status == 201) {
          toast.success(data.data.message)
        } else {
          toast.error(data.data.message)
        }
      })
      .catch(error => {
        toast.error(error.message)
        navigate('/event/add')
      })
  }

  const handleRegisterButton = async () => {
    //add record in food requirement classes list
    foodRequirementList.push('No Requirement')
    foodRequirementList.push('No Pork')
    foodRequirementList.push('Vegetarian')
    let myObject = {
      registeration_type: registerationType.value,
      event_id: eventId,
      first_name: firstName,
      last_name: lastName,
      email: companyEmail,
      company: companyName,
      hotel_reservation: hotelReservation.name == 'hotelYes' ? true : false,
      shuttle_transport: shuttleTransport.name == 'shuttleYes' ? true : false,
      food_requirements:
        foodRequirement.name == 'Other, please specify'
          ? otherFoodRequirement
          : foodRequirement.name,
    }

    //console.log('called api: ' + JSON.stringify(myObject))
    await API.post('training/training_registeration', myObject)
      .then(data => {
        //console.log(data)
        if (data.status == 200 || data.status == 201) {
          toast.success(data.data.message)
        } else if (data.message.Fail) {
          toast.error(data.data.message.Fail)
        }
      })
      .catch(error => {
        //console.log(error)
        toast.error(error.message)
        navigate('/event/update/' + eventId)
      })
  }
  return (
    <>
      <Header isLogedIn={getToken()} />
      <div className="row mx-2 mx-md-5 mt-4 mb-2 h-100">
        <div className="col event-setting-container">
          <PrimaryHeading title={'RYC Event Calender'} backgroundImage={'yk-back-image-event'} />
        </div>
      </div>

      <div
        style={{
          width: '100%',
          justifyContent: 'center',
          display: 'flex',
          padding: '0px 60px',
          flexDirection: 'column',
        }}
      >
        <div
          style={
            trainingFormDisable
              ? {
                  pointerEvents: 'none',
                  opacity: '0.4',
                  width: '100%',
                  padding: '5px',
                  marginTop: '30px',
                  userSelect: 'none',
                }
              : { marginTop: '30px' }
          }
        >
          <div
            style={{
              boxShadow: 'rgba(136, 136, 136, 0.8) 0px 0px 20px -5px',
              borderRadius: '5px',
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
              <form
                style={{
                  alignItems: 'flex-start',
                  width: '100%',
                  marginTop: '10px',
                }}
              >
                <div className="row" style={{ width: '100%' }}>
                  <div className="col-md-8" style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }} className="col-md-4">
                      Training Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={event => {
                        setTrainingName(event.target.value)
                      }}
                      value={trainingName}
                    />
                  </div>
                </div>
                <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                  <div className="col-md-8" style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }} className="col-md-4">
                      Start date
                    </label>
                    <DatePicker
                      minDate={new Date()}
                      className="form-control"
                      onChange={date => {
                        if (endDate != null && endDate != undefined && endDate >= date) {
                          setDuration(moment(endDate).diff(date, 'days'))
                          setStartDate(date)
                        } else {
                          toast.error('End date should be greater than start date')
                          setStartDate('')
                        }
                      }}
                      placeholderText="DDMMYYYY"
                      dateFormat="dd/M/Y"
                      selected={startDate}
                      open={isStartDateOpen}
                      onSelect={() => {
                        setIsStartDateOpen(false)
                      }}
                      onInputClick={() => {
                        setIsStartDateOpen(!isStartDateOpen)
                      }}
                    />
                    <div
                      style={{
                        zIndex: '1',
                        marginLeft: '-30px',
                        marginTop: '7px',
                      }}
                      onClick={() => {
                        setIsStartDateOpen(!isStartDateOpen)
                      }}
                    >
                      {registeredAttendeesListModalOpen == false ? (
                        <i class="fa-solid fa-calendar-days" style={{ color: 'rgb(0, 79, 155)' }} />
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                  <div className="col-md-8" style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }} className="col-md-4">
                      End date
                    </label>
                    <DatePicker
                      minDate={startDate}
                      className="form-control"
                      onChange={date => {
                        setEndDate(date)
                        if (startDate != null || startDate != undefined) {
                          setDuration(moment(date).diff(startDate, 'days') + 1)
                        }
                      }}
                      placeholderText="DDMMYYYY"
                      dateFormat="dd/M/Y"
                      selected={endDate}
                      open={isEndDateOpen}
                      onSelect={() => {
                        setIsEndDateOpen(false)
                      }}
                      onInputClick={() => {
                        setIsEndDateOpen(!isEndDateOpen)
                      }}
                    />

                    <div
                      style={{
                        zIndex: '1',
                        marginLeft: '-30px',
                        marginTop: '7px',
                      }}
                      onClick={() => {
                        setIsEndDateOpen(!isEndDateOpen)
                      }}
                    >
                      {isStartDateOpen == true || registeredAttendeesListModalOpen == true ? (
                        <i
                          class="fa-solid fa-calendar-days"
                          style={{ color: 'rgb(0, 79, 155)', display: 'none' }}
                        />
                      ) : (
                        <i class="fa-solid fa-calendar-days" style={{ color: 'rgb(0, 79, 155)' }} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                  <div className="col-md-8" style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }} className="col-md-4">
                      Duration
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      onChange={event => {
                        setDuration(event.target.value)
                      }}
                      disabled
                      value={duration}
                    />
                  </div>
                </div>
                <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                  <div className="col-md-8" style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }} className="col-md-4">
                      Costs
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: '200px' }}
                      pattern="[0-9]"
                      onChange={event => {
                        //console.log()
                        let value = event.target.value.match(/\d+/)?.join('')
                        setCost(value)
                      }}
                      value={cost}
                    />
                  </div>
                </div>

                <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                  <div className="col-md-8" style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }} className="col-md-4">
                      Location
                    </label>
                    <textarea
                      rows="3"
                      cols="30"
                      className="form-control"
                      onChange={event => {
                        setLocation(event.target.value)
                      }}
                      value={location}
                    />
                  </div>
                </div>

                <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                  <div className="col-md-8" style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }} className="col-md-4">
                      Type of Events
                    </label>
                    <Select
                      className="select-box"
                      options={eventOptionList}
                      onChange={event => {
                        if (event.value == 'webinar') {
                          setDisabled(true)
                        } else {
                          setDisabled(false)
                        }
                        let obj = eventOptionList.find(e => e.value == event.value)
                        setEventOption(obj)
                      }}
                      value={eventOption}
                    />
                  </div>
                </div>

                <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                  <div
                    className="col-md-8"
                    style={
                      eventOption.value == 'webinar'
                        ? {
                            display: 'flex',
                            justifyContent: 'space-between',
                            pointerEvents: 'none',
                            opacity: '0.4',
                            userSelect: 'none',
                          }
                        : { display: 'flex', justifyContent: 'space-between' }
                    }
                  >
                    <div style={{ display: 'flex' }} className="col-md-8">
                      <label
                        style={{ fontWeight: 'bold', marginLeft: '-15px' }}
                        className="col-md-6"
                      >
                        Max attendees
                      </label>
                      <input
                        type="text"
                        className="form-control col-md-8"
                        pattern="[0-9]"
                        style={{
                          width: '70px',
                          float: 'left',
                          marginLeft: '15px',
                        }}
                        onChange={event => {
                          let value = Number(event.target.value.match(/\d+/)?.join(''))
                          setMaxAttendeed(value)
                        }}
                        onBlur={event => {
                          if (remainSeat && remainSeat > maxAttendacees) {
                            toast.error("Remain seat can't greater that max attendeed")
                          }
                        }}
                        value={maxAttendacees}
                      />
                    </div>
                    <div
                      style={{ display: 'inline-flex', alignItems: 'center' }}
                      className="col-md-8"
                    >
                      <label style={{ fontWeight: 'bold' }} className="col-md-6">
                        Remaining Seats
                      </label>
                      <input
                        type="text"
                        className="form-control col-md-8"
                        style={{
                          width: '70px',
                          float: 'left',
                          marginLeft: '45px',
                        }}
                        pattern="[0-9]"
                        onChange={event => {
                          //console.log()
                          let value = Number(event.target.value.match(/\d+/)?.join(''))
                          console.log(maxAttendacees + ':' + value)
                          setRemainSeats(value)
                        }}
                        onBlur={event => {
                          if (maxAttendacees != remainSeat) {
                            toast.error('Max attedees and remain attendees should be equal')
                            setRemainSeats(0)
                          }
                        }}
                        value={remainSeat}
                      />
                    </div>
                  </div>
                </div>

                <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                  <div className="col-md-8" style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }} className="col-md-4">
                      Classification level
                    </label>
                    <Select
                      className="select-box"
                      options={classificationOption}
                      onChange={event => {
                        //console.log(event.label + ' selected:' + event.value)
                        setClassificationLevel({
                          value: event.value,
                          label: event.label,
                        })
                      }}
                      selected={classificationLevel}
                      value={classificationLevel}
                    />
                  </div>
                </div>

                <div style={{ width: '100%', marginTop: '10px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '40%',
                      margin: '10px 15px 0',
                    }}
                  >
                    <button
                      style={{
                        width: 'auto',
                        background: 'rgb(0, 79, 155)',
                        color: 'white',
                        border: '1px solid black',
                        borderRadius: '3px',
                        fontSize: '13px',
                        padding: '5px',
                      }}
                      onClick={event => {
                        setDependOnButton('agenda')
                        setLinkModal(true)
                        openModal(event)
                      }}
                    >
                      Agenda
                    </button>
                    <button
                      style={{
                        width: 'auto',
                        background: 'rgb(0, 79, 155)',
                        color: 'white',
                        border: '1px solid black',
                        borderRadius: '3px',
                        fontSize: '13px',
                        padding: '5px',
                      }}
                      onClick={event => {
                        setDependOnButton('alink')
                        setLinkModal(true)
                        openModal(event)
                      }}
                    >
                      Other Possible link A
                    </button>
                    <button
                      style={{
                        width: 'auto',
                        background: 'rgb(0, 79, 155)',
                        color: 'white',
                        border: '1px solid black',
                        borderRadius: '3px',
                        fontSize: '13px',
                        padding: '5px',
                      }}
                      onClick={event => {
                        setDependOnButton('blink')
                        setLinkModal(true)
                        openModal(event)
                      }}
                    >
                      Other Possible Link B
                    </button>
                  </div>
                </div>

                <div style={{ width: '100%', marginTop: '40px', padding: '0 15px' }}>
                  <h4>Requirements for the event</h4>
                  <ul class="requirements-list">
                    {requirement.map(e => {
                      return (
                        <li style={{ fontSize: '16px' }}>
                          <label>{e}</label>
                        </li>
                      )
                    })}
                  </ul>

                  <div>
                    {moreInputFlag == true ? (
                      <h6
                        style={{ marginLeft: '29px' }}
                        onClick={() => {
                          setMoreInputFlag(!moreInputFlag)
                        }}
                      >
                        <i
                          style={{ color: 'rgb(0, 79, 155)', marginRight: '0.5rem' }}
                          class="fa-solid fa-circle-plus"
                        />
                        <span>more</span>
                      </h6>
                    ) : (
                      <div
                        style={{
                          justifyContent: 'space-between',
                          display: 'flex',
                          width: '40%',
                        }}
                        className="row align-items-center"
                      >
                        <div className="col-md-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={event => {
                              setSingleRequirement(event.target.value)
                            }}
                            value={singleRequirement}
                          />
                        </div>
                        <div className="col-md-2">
                          <button
                            style={{
                              width: 'auto',
                              background: 'rgb(0, 79, 155)',
                              color: 'white',
                              border: '1px solid black',
                              borderRadius: '3px',
                              fontSize: '15px',
                            }}
                            onClick={event => {
                              setMoreInputFlag(true)
                              if (singleRequirement != null && singleRequirement != '') {
                                requirement.push(singleRequirement)
                                setSingleRequirement('')
                              }
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={event => {
                      handlePublishButton(event)
                    }}
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
                  <button
                    onClick={event => {
                      event.preventDefault()
                      setRegisteredAttendeesListModalOpen(!registeredAttendeesListModalOpen)
                    }}
                    style={{
                      background: 'rgb(0, 79, 155)',
                      color: 'white',
                      border: '1px solid black',
                      borderRadius: '3px',
                      fontSize: '13px',
                      float: 'right',
                      padding: '5px',
                      marginTop: '15px',
                    }}
                  >
                    Registered attendees list
                  </button>
                </div>
              </form>

              <div
                style={{
                  width: '50%',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '500px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <textarea
                    style={{ marginTop: '10px' }}
                    rows="8"
                    // cols="30"
                    placeholder="Enter description..."
                    className="form-control description-box"
                    onChange={event => {
                      setDescription(event.target.value)
                    }}
                    value={description}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            width: '100%',
            marginTop: '3%',
          }}
        >
          <div
            style={{
              boxShadow: 'rgba(136, 136, 136, 0.8) 0px 0px 20px -5px',
              borderRadius: '5px',
              width: '100%',
              paddingBottom: '50px',
              marginBottom: '100px',
            }}
          >
            <div>
              {eventId ? (
                <h4 style={{ padding: '20px' }}>Register for {trainingName}</h4>
              ) : (
                <h4 style={{ padding: '20px' }}>Register for Trainings</h4>
              )}
            </div>
            <div
              style={{
                padding: '20px',
                width: '100%',
                display: 'flex',
              }}
            >
              <form style={{ alignItems: 'flex-start', width: '100%' }}>
                <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                  <div
                    className="col-md-9"
                    style={
                      getUserRoles() == 'Technical Administrator' ||
                      getUserRoles() == 'PMK Administrator'
                        ? { display: 'flex' }
                        : {
                            pointerEvents: 'none',
                            opacity: '0.4',
                            userSelect: 'none',
                            display: 'flex',
                          }
                    }
                  >
                    <Select
                      className="select-box"
                      options={registerationTypeOption}
                      onChange={event => {
                        //console.log(event.label + ' selected:' + event.value)
                        setRegistrationType({
                          value: event.value,
                          label: event.label,
                        })
                        if (event.value == 'internal') {
                          setFirstName(userProfile['basic_profile'].full_name)
                          setCompanyEmail(userProfile['basic_profile'].email)
                          setCompanyName(userProfile['basic_profile'].company_name)
                        } else {
                          setFirstName('')
                          setCompanyEmail('')
                          setCompanyName('')
                        }
                      }}
                      selected={registerationType}
                      value={registerationType}
                    />
                  </div>
                </div>
                <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                  <div className="col-md-8" style={{ display: 'flex' }}>
                    <input
                      type="text"
                      placeholder="First Name"
                      className="col-md-3 form-control"
                      style={{ width: '400px' }}
                      value={firstName}
                      onChange={event => {
                        setFirstName(event.target.value)
                      }}
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
                      value={lastName}
                      onChange={event => {
                        setLastName(event.target.value)
                      }}
                    />
                  </div>
                </div>

                <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                  <div className="col-md-8" style={{ display: 'flex' }}>
                    <input
                      type="email"
                      placeholder="Company E-Mail ID"
                      className="col-md-3 form-control"
                      style={{ width: '400px' }}
                      value={companyEmail}
                      onChange={event => {
                        setCompanyEmail(event.target.value)
                      }}
                      required
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
                      value={companyName}
                      onChange={event => {
                        setCompanyName(event.target.value)
                      }}
                    />
                  </div>
                </div>

                <div
                  className="row"
                  style={
                    disabled
                      ? {
                          pointerEvents: 'none',
                          opacity: '0.4',
                          width: '100%',
                          padding: '5px',
                          userSelect: 'none',
                        }
                      : { width: '100%', padding: '5px' }
                  }
                >
                  <div className="col-md-8" style={{ marginTop: '20px', marginLeft: '-20px' }}>
                    <label style={{ fontWeight: 'bold' }} className="col-md-4">
                      Hotel reservation required
                    </label>
                  </div>
                  <div
                    className="row"
                    style={{ width: '100%', display: 'inline', marginLeft: '20px' }}
                  >
                    <div
                      className="col-md-3"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '6%',
                        marginTop: '10px',
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="col-md-4 form-check-input"
                        checked={hotelReservation.name == 'hotelYes' ? true : false}
                        name="hotelYes"
                        onChange={event => {
                          setHotelReservation(event.target)
                        }}
                      />
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
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="col-md-4 form-check-input"
                        checked={hotelReservation.name == 'hotelNo' ? true : false}
                        name="hotelNo"
                        onChange={event => {
                          setHotelReservation(event.target)
                        }}
                      />
                      <label class="form-check-label" for="no">
                        No
                      </label>
                    </div>
                  </div>

                  <div className="col-md-8" style={{ marginTop: '20px', marginLeft: '-20px' }}>
                    <label style={{ fontWeight: 'bold' }} className="col-md-5">
                      Assist with organization of shuttle transport
                    </label>
                  </div>
                  <div
                    className="row"
                    style={{ width: '100%', display: 'inline', marginLeft: '20px' }}
                  >
                    <div
                      className="col-md-3"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '6%',
                        marginTop: '10px',
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="col-md-4 form-check-input"
                        checked={shuttleTransport.name == 'shuttleYes' ? true : false}
                        name="shuttleYes"
                        onChange={event => {
                          setShuttleTransport(event.target)
                        }}
                      />
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
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="col-md-4 form-check-input"
                        checked={shuttleTransport.name == 'shuttleNo' ? true : false}
                        name="shuttleNo"
                        onChange={event => {
                          setShuttleTransport(event.target)
                        }}
                      />
                      <label class="form-check-label" for="no">
                        No
                      </label>
                    </div>
                  </div>

                  <div className="col-md-8" style={{ marginTop: '20px', marginLeft: '-20px' }}>
                    <label style={{ fontWeight: 'bold' }} className="col-md-5">
                      Special food requirement
                    </label>
                  </div>
                  <div
                    className="row"
                    style={{ width: '100%', display: 'inline', marginLeft: '20px' }}
                  >
                    <div
                      className="col-md-3"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '250px',
                        marginTop: '10px',
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={foodRequirement.name == 'No Requirement' ? true : false}
                        name="No Requirement"
                        onChange={event => {
                          setFoodRequirement(event.target)
                        }}
                      />
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
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="col-md-4 form-check-input"
                        checked={foodRequirement.name == 'No Pork' ? true : false}
                        name="No Pork"
                        onChange={event => {
                          setFoodRequirement(event.target)
                        }}
                      />
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
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="col-md-4 form-check-input"
                        checked={foodRequirement.name == 'Vegetarian' ? true : false}
                        name="Vegetarian"
                        onChange={event => {
                          setFoodRequirement(event.target)
                        }}
                      />
                      <label class="form-check-label" for="no">
                        Vegetarian
                      </label>
                    </div>
                    <div
                      className="col-md-3"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '740px',
                        marginTop: '10px',
                        position: 'relative',
                        marginLeft: '30px',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={foodRequirement.name == 'Other, please specify' ? true : false}
                        name="Other, please specify"
                        onChange={event => {
                          setFoodRequirement(event.target)
                        }}
                      />
                      <label class="form-check-label" for="no">
                        Other, please specify
                      </label>
                      {foodRequirement.name == 'Other, please specify' && (
                        <input
                          type="text"
                          className="form-control "
                          style={{ position: 'absolute', left: '200px' }}
                          value={otherFoodRequirement}
                          onChange={event => {
                            setOtherFoodRequirement(event.target.value)
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="row">
              <div style={{ marginLeft: '25px', marginTop: '10px' }}>
                <div
                  className="col-md-4"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '740px',
                    marginTop: '10px',
                  }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={termsPolicy}
                    onChange={() => {
                      setTermPolicy(!termsPolicy)
                    }}
                  />
                </div>
                <label style={{ marginLeft: '20px' }}>
                  By signing up, you agree with{' '}
                  <label
                    style={{
                      color: 'rgb(0, 79, 155)',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                    onClick={() => {
                      navigate('/privacy-policy')
                    }}
                  >
                    Terms of service and Privacy Policy
                  </label>
                </label>
              </div>
              <div
                style={{
                  width: '80%',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <button
                  onClick={() => {
                    if (termsPolicy == true) handleRegisterButton()
                    else {
                      alert('Accept Term of service and policy')
                    }
                  }}
                  style={{
                    background: 'rgb(0, 79, 155)',
                    color: 'white',
                    border: '1px solid black',
                    borderRadius: '3px',
                    fontSize: '13px',
                    marginLeft: '20px',
                  }}
                >
                  Register
                </button>

                <div
                  style={
                    trainingFormDisable
                      ? {
                          pointerEvents: 'none',
                          opacity: '0.4',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '45%',
                          userSelect: 'none',
                        }
                      : {
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '45%',
                        }
                  }
                >
                  <label style={{ fontWeight: 'bold', marginBottom: 0 }}>
                    Registration can be cancelled until
                  </label>
                  <DatePicker
                    disabled
                    minDate={new Date()}
                    className="form-control"
                    onChange={date => setCancelledDate(date)}
                    placeholderText="DDMMYYYY"
                    dateFormat="dd/M/Y"
                    selected={cancelledDate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
          {linkModal && (
            <CustomeModel
              title={
                dependOnButton == 'agenda'
                  ? 'Agenda'
                  : dependOnButton == 'alink'
                  ? 'Other possible Link A '
                  : dependOnButton == 'blink'
                  ? 'Other possible link B'
                  : null
              }
              placeholder="Enter link"
              setMessage={
                dependOnButton == 'agenda'
                  ? setAgendaMessage
                  : dependOnButton == 'alink'
                  ? setAlinkMessage
                  : dependOnButton == 'blink'
                  ? setBlinkMessage
                  : null
              }
              value={
                dependOnButton == 'agenda'
                  ? agendaMessage
                  : dependOnButton == 'alink'
                  ? alinkMessage
                  : dependOnButton == 'blink'
                  ? blinkMessage
                  : null
              }
              closeModal={closeModal}
              handleSendButton={closeModal}
            />
          )}
        </Modal>
      </div>

      <div>
        <Modal
          isOpen={registeredAttendeesListModalOpen}
          onRequestClose={() => {
            registeredAttendeesListModalOpen(false)
          }}
          style={customStyles2}
        >
          <div>
            <div style={{ float: 'right' }}>
              <img
                style={{
                  height: '20px',
                  width: '20px',
                }}
                src={CloseIcon}
                onClick={() => {
                  //console.log('Close modal..')
                  setRegisteredAttendeesListModalOpen(false)
                }}
              />
            </div>
            <div>
              <h4>Registered attendees list</h4>
              <Table
                style={{
                  border: '1px solid',
                }}
              >
                <thead>
                  <tr style={{ background: 'rgb(0, 79, 155)', color: 'white' }}>
                    <td>Name</td>
                    <td>Email Id</td>
                    <td>User from Internal/External</td>
                    <td>Register by</td>
                    <td>Date</td>
                  </tr>
                </thead>
                <tbody>
                  {registeredAttendeesList.map(e => {
                    return (
                      <tr>
                        <td>{e.name}</td>
                        <td>{e.email_id}</td>
                        <td>{classificationOption.find(ele => ele.value == e.category).label}</td>
                        <td>{e.registeredBy}</td>
                        <td>{e.date}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}

export default AddEventScreen
