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
import { validateUrl } from '../../utils/urlValidator'

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
  const [modalIsOpen, setIsOpen] = useState(false)
  const [moreInputFlag, setMoreInputFlag] = useState(true)
  const [agendaMessage, setAgendaMessage] = useState('')
  const [alinkMessage, setAlinkMessage] = useState('')
  const [blinkMessage, setBlinkMessage] = useState('')
  const [dependOnButton, setDependOnButton] = useState('')
  const [linkModal, setLinkModal] = useState(false)

  const requirementCountRef = useRef(0)

  const isAdmin =
    getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'

  const [classificationLevel, setClassificationLevel] = useState({
    value: 'internal',
    label: 'Internal Training',
  })
  const [registerationType, setRegistrationType] = useState(
    getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'
      ? {
          value: 'internal',
          label: 'Self registration',
        }
      : { value: 'external', label: 'Others' }
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
    { value: 'internal', label: 'Self registration' },
    { value: 'external', label: 'Others' },
  ]

  const classificationOption = [
    { value: 'internal', label: 'Internal Training' },
    { value: 'external', label: 'External Training' },
  ]

  useEffect(async () => {
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
            const name = result['basic_profile'].full_name.split(' ')
            setFirstName(name[0])
            if (name.length > 1) {
              setLastName(name.slice(1).join(' '))
            } else {
              setLastName(' ')
            }
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
          setEventOption(
            eventOptionList.find(event => event.value === result.event_details['event_type'])
          )
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
          if (result.event_details.classification_level == 'internal') {
            setRegistrationType(registerationTypeOption.find(e => e.value == 'internal'))
          }
          setCost(result.event_details['cost'])
          setAgendaMessage(result.links['agenda_link'])
          setAlinkMessage(result.links['link_a'])
          setBlinkMessage(result.links['link_b'])
          setRequirement(result.requirements)
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
    const preparedRequirementList = Object.values(requirement)
    preparedRequirementList.sort((a, b) => a.id - b.id)

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
      requirements: preparedRequirementList.map(item => item.value),
    }

    //console.log('called api: ' + JSON.stringify(eventObject))
    await API.post('training/training_addition', eventObject)
      .then(data => {
        if (data.status == 200 || data.status == 201) {
          toast.success(data.data.message)
          navigate(-1)
        } else {
          toast.error(data.data.message)
          navigate(-1)
        }
      })
      .catch(() => {
        navigate('/event/add')
      })
  }

  const handleRegisterButton = async () => {
    if (eventOption.value !== 'webinar') {
      if (
        hotelReservation?.name === undefined
        // shuttleTransport?.name === undefined ||
        // foodRequirement?.name === undefined
      ) {
        toast.error('Hotel reservation is manadatory')
        return
      }
      if (
        // hotelReservation?.name === undefined ||
        shuttleTransport?.name === undefined
        // foodRequirement?.name === undefined
      ) {
        toast.error('Shuttle transport is manadatory')
        return
      }
      if (
        // hotelReservation?.name === undefined ||
        // shuttleTransport?.name === undefined ||
        foodRequirement?.name === undefined
      ) {
        toast.error('Food requirement is manadatory')
        return
      }
    }
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
          navigate(-1)
          toast.success(data.data.message)
        } else if (data.message.Fail) {
          toast.error(data.data.message.Fail)
        }
      })
      .catch(() => {
        window.scrollTo(0, 0)
        navigate('/event/update/' + eventId)
      })
  }
  return (
    <>
      <Header isLogedIn={getToken()} />
      <div className="row mx-2 mx-md-5 mt-4 mb-2 h-100">
        <div className="col event-setting-container">
          <PrimaryHeading title="RYG Event Calendar" backgroundImage={'yk-back-image-event'} />
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
        <div style={{ marginTop: '30px', marginBottom: eventId ? 0 : '60px' }}>
          <div
            style={{
              boxShadow: 'rgba(136, 136, 136, 0.8) 0px 0px 20px -5px',
              borderRadius: '5px',
            }}
          >
            <h4 style={{ padding: '20px' }}>Rotomass TI Service Training</h4>
            <div
              style={{
                padding: '0px 20px 20px',
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
                      disabled={eventId}
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
                      calendarStartDay={1}
                      minDate={new Date()}
                      className="form-control"
                      onChange={date => {
                        if (endDate != null && endDate != undefined && endDate >= date) {
                          setDuration(moment(endDate).diff(date, 'days'))
                          setStartDate(date)
                        } else {
                          setDuration(moment(date).diff(date, 'days'))
                          setStartDate(date)
                          setEndDate(date)
                          // toast.error('End date should be greater than start date')
                        }
                      }}
                      placeholderText="DDMMYYYY"
                      dateFormat="dd/M/Y"
                      selected={startDate}
                      disabled={eventId}
                    />
                    <div
                      style={
                        eventId
                          ? { display: 'none' }
                          : {
                              zIndex: '1',
                              marginLeft: '-30px',
                              marginTop: '7px',
                              pointerEvents: 'none',
                            }
                      }
                    >
                      <i
                        className="fa-solid fa-calendar-days"
                        style={{ color: 'rgb(0, 79, 155)' }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                  <div className="col-md-8" style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }} className="col-md-4">
                      End date
                    </label>
                    <DatePicker
                      calendarStartDay={1}
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
                      disabled={eventId}
                    />

                    <div
                      style={
                        eventId
                          ? { display: 'none' }
                          : {
                              zIndex: '1',
                              marginLeft: '-30px',
                              marginTop: '7px',
                              pointerEvents: 'none',
                            }
                      }
                    >
                      <i
                        className="fa-solid fa-calendar-days"
                        style={{ color: 'rgb(0, 79, 155)' }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                  <div className="col-md-8" style={{ display: 'flex' }}>
                    <label style={{ fontWeight: 'bold' }} className="col-md-4">
                      Cancellation Date
                    </label>
                    <DatePicker
                      calendarStartDay={1}
                      minDate={new Date()}
                      maxDate={moment(startDate).subtract(1, 'day').toDate()}
                      className="form-control"
                      onChange={date => {
                        if (moment(date).isBefore(startDate)) {
                          setCancelledDate(date)
                        } else {
                          toast.error('Cancellation date should be before start date')
                        }
                      }}
                      placeholderText="DDMMYYYY"
                      dateFormat="dd/M/Y"
                      selected={cancelledDate}
                      disabled={eventId}
                    />

                    <div
                      style={
                        eventId
                          ? { display: 'none' }
                          : {
                              zIndex: '1',
                              marginLeft: '-30px',
                              marginTop: '7px',
                              pointerEvents: 'none',
                            }
                      }
                    >
                      <i
                        className="fa-solid fa-calendar-days"
                        style={{ color: 'rgb(0, 79, 155)' }}
                      />
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
                      type="number"
                      step=".01"
                      presicion={2}
                      className="form-control hide-spinners"
                      onChange={event => {
                        //console.log()
                        // let value = event.target.value.match(/\d+/)?.join('')
                        setCost(event.target.value)
                      }}
                      value={cost}
                      disabled={eventId}
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
                      disabled={eventId}
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
                      isDisabled={eventId}
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
                    {isAdmin && (
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
                            let value = +event.target.value || 0
                            setMaxAttendeed(value)
                            setRemainSeats(value)
                          }}
                          onBlur={event => {
                            if (remainSeat && remainSeat > maxAttendacees) {
                              toast.error("Remaining seat can't greater that max attendees")
                            }
                          }}
                          value={maxAttendacees}
                          disabled={eventId}
                        />
                      </div>
                    )}
                    <div
                      style={{ display: 'inline-flex', alignItems: 'center' }}
                      className="col-md-8"
                    >
                      <label
                        style={{
                          fontWeight: 'bold',
                          marginLeft: !isAdmin ? '-15px' : 0,
                          whiteSpace: 'nowrap',
                        }}
                        className="ms-3 col-md-4"
                      >
                        Remaining Seats
                      </label>
                      <input
                        type="text"
                        className="form-control col-md-8"
                        style={{
                          width: '70px',
                          float: 'left',
                          marginLeft: !isAdmin ? '15px' : '45px',
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
                            toast.error('Max attendees and remaining attendees should be equal')
                            setRemainSeats(0)
                          }
                        }}
                        value={remainSeat}
                        disabled={true}
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

                        if (event.value === 'external') {
                          setRegistrationType({
                            value: 'internal',
                            label: 'Self registration',
                          })
                        }
                      }}
                      selected={classificationLevel}
                      value={classificationLevel}
                      isDisabled={eventId}
                    />
                  </div>
                </div>

                <div style={{ width: '100%', marginTop: '10px' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0 20px',
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
                        if (isAdmin) {
                          setDependOnButton('agenda')
                          setLinkModal(true)
                          openModal(event)
                        } else {
                          event.preventDefault()
                          window.open(agendaMessage, '_blank')
                        }
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
                        if (isAdmin) {
                          setDependOnButton('alink')
                          setLinkModal(true)
                          openModal(event)
                        } else {
                          event.preventDefault()
                          window.open(alinkMessage, '_blank')
                        }
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
                        if (isAdmin) {
                          setDependOnButton('blink')
                          setLinkModal(true)
                          openModal(event)
                        } else {
                          event.preventDefault()
                          window.open(blinkMessage, '_blank')
                        }
                      }}
                    >
                      Other Possible Link B
                    </button>
                  </div>
                </div>

                <div style={{ width: '100%', marginTop: '40px', padding: '0 15px' }}>
                  <h4>Requirements for the event</h4>
                  <ul className="requirements-list">
                    {!eventId
                      ? Object.entries(requirement).map(([key, e]) => {
                          return (
                            <li key={key}>
                              {e.isEditing ? (
                                <input
                                  type="text"
                                  value={e.value}
                                  onChange={event => {
                                    let value = event.target.value
                                    setRequirement({
                                      ...requirement,
                                      [key]: {
                                        ...e,
                                        value,
                                      },
                                    })
                                  }}
                                />
                              ) : (
                                <label>{e.value}</label>
                              )}
                              <span>
                                {e.isEditing ? (
                                  <i
                                    className="fa-solid fa-save"
                                    style={{
                                      marginLeft: '12px',
                                      cursor: 'pointer',
                                      color: '#004f9b',
                                    }}
                                    onClick={() => {
                                      const newRequirement = { ...requirement }
                                      newRequirement[key].isEditing = false
                                      setRequirement(newRequirement)
                                    }}
                                  ></i>
                                ) : (
                                  <i
                                    className="fa-solid fa-edit"
                                    style={{
                                      marginLeft: '10px',
                                      cursor: 'pointer',
                                      color: '#004f9b',
                                    }}
                                    onClick={() => {
                                      const newRequirement = { ...requirement }
                                      newRequirement[key].isEditing = true
                                      setRequirement(newRequirement)
                                    }}
                                  ></i>
                                )}
                                <i
                                  className="fa-solid fa-trash"
                                  style={{
                                    cursor: 'pointer',
                                    color: '#cd2727',
                                  }}
                                  onClick={() => {
                                    setRequirement(prev => {
                                      const newRequirement = { ...prev }
                                      delete newRequirement[key]
                                      return newRequirement
                                    })
                                  }}
                                ></i>
                              </span>
                            </li>
                          )
                        })
                      : requirement.map(e => {
                          return (
                            <li className="preview" style={{ fontSize: '16px' }}>
                              <label>{e}</label>
                            </li>
                          )
                        })}
                  </ul>

                  {!eventId && (
                    <div className="requirement-more-input">
                      {moreInputFlag == true ? (
                        <h6
                          onClick={() => {
                            setMoreInputFlag(!moreInputFlag)
                          }}
                        >
                          <i
                            style={{ color: 'rgb(0, 79, 155)', marginRight: '0.5rem' }}
                            className="fa-solid fa-circle-plus"
                          />
                          <span>more</span>
                        </h6>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            gap: '1rem',
                          }}
                        >
                          <div>
                            <input
                              type="text"
                              className="form-control"
                              onChange={event => {
                                setSingleRequirement(event.target.value)
                              }}
                              value={singleRequirement}
                            />
                          </div>
                          <div className="btn-group">
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
                                  const newId = ++requirementCountRef.current
                                  setRequirement(requirement => ({
                                    ...requirement,
                                    [newId]: {
                                      id: newId,
                                      value: singleRequirement,
                                      isEditing: false,
                                    },
                                  }))
                                  setSingleRequirement('')
                                }
                              }}
                            >
                              Save
                            </button>
                            <button
                              style={{
                                marginLeft: '10px',
                                width: 'auto',
                                background: 'rgb(0, 79, 155)',
                                color: 'white',
                                border: '1px solid black',
                                borderRadius: '3px',
                                fontSize: '15px',
                              }}
                              onClick={() => {
                                setSingleRequirement('')
                                setMoreInputFlag(true)
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!eventId && (
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
                  )}
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
                    disabled={eventId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {eventId && (
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
                  <h4 style={{ padding: '20px 20px 0' }}>Register for {trainingName}</h4>
                ) : (
                  <h4 style={{ padding: '20px 20px 0' }}>Register for Trainings</h4>
                )}
              </div>
              <div
                style={{
                  padding: '20px 0 20px 35px',
                  width: '100%',
                  display: 'flex',
                }}
              >
                <form style={{ alignItems: 'flex-start', width: '100%' }}>
                  <div className="row" style={{ width: '100%', marginTop: '10px' }}>
                    <div className="col-md-9" style={{ display: 'flex' }}>
                      <Select
                        className="select-box"
                        options={
                          classificationLevel.value === 'internal'
                            ? registerationTypeOption.filter(e => e.value !== 'external')
                            : registerationTypeOption
                        }
                        onChange={event => {
                          //console.log(event.label + ' selected:' + event.value)
                          setRegistrationType({
                            value: event.value,
                            label: event.label,
                          })
                          if (event.value == 'internal') {
                            const name = userProfile['basic_profile'].full_name.split(' ')
                            setFirstName(name[0])
                            if (name.length > 1) {
                              setLastName(name.slice(1).join(' '))
                            } else {
                              setLastName(' ')
                            }
                            setCompanyEmail(userProfile['basic_profile'].email)
                            setCompanyName(userProfile['basic_profile'].company_name)
                          } else {
                            setFirstName('')
                            setLastName('')
                            setCompanyEmail('')
                            setCompanyName('')
                          }
                        }}
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
                        disabled={eventId && registerationType.value == 'internal'}
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
                        disabled={eventId && registerationType.value == 'internal'}
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
                        disabled={eventId && registerationType.value == 'internal'}
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
                        disabled={eventId && registerationType.value == 'internal'}
                        onChange={event => {
                          setCompanyName(event.target.value)
                        }}
                      />
                    </div>
                  </div>

                  <div className="row" style={{ width: '100%', marginLeft: '8px' }}>
                    <div className="col-md-8" style={{ marginTop: '20px', marginLeft: '-20px' }}>
                      <label style={{ fontWeight: 'bold' }}>Hotel reservation required</label>
                    </div>
                    <div className="row">
                      <div className="row ms-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={hotelReservation.name == 'hotelYes' ? true : false}
                          name="hotelYes"
                          onChange={event => {
                            setHotelReservation(event.target)
                          }}
                          disabled={eventOption.value === 'webinar'}
                        />
                        <label className="form-check-label" for="yes">
                          Yes
                        </label>
                      </div>
                      <div className="row ms-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={hotelReservation.name == 'hotelNo' ? true : false}
                          name="hotelNo"
                          onChange={event => {
                            setHotelReservation(event.target)
                          }}
                          disabled={eventOption.value === 'webinar'}
                        />
                        <label className="form-check-label" for="no">
                          No
                        </label>
                      </div>
                    </div>

                    <div className="col-md-8" style={{ marginTop: '20px', marginLeft: '-20px' }}>
                      <label style={{ fontWeight: 'bold' }}>
                        Assist with organization of shuttle transport
                      </label>
                    </div>
                    <div className="row">
                      <div className="row ms-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={shuttleTransport.name == 'shuttleYes' ? true : false}
                          name="shuttleYes"
                          onChange={event => {
                            setShuttleTransport(event.target)
                          }}
                          disabled={eventOption.value === 'webinar'}
                        />
                        <label className="form-check-label" for="yes">
                          Yes
                        </label>
                      </div>
                      <div className="row ms-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={shuttleTransport.name == 'shuttleNo' ? true : false}
                          name="shuttleNo"
                          onChange={event => {
                            setShuttleTransport(event.target)
                          }}
                          disabled={eventOption.value === 'webinar'}
                        />
                        <label className="form-check-label" for="no">
                          No
                        </label>
                      </div>
                    </div>

                    <div className="col-md-8" style={{ marginTop: '20px', marginLeft: '-20px' }}>
                      <label style={{ fontWeight: 'bold' }}>Special food requirement</label>
                    </div>
                    <div className="row">
                      <div className="row ms-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={foodRequirement.name == 'No Requirement' ? true : false}
                          name="No Requirement"
                          onChange={event => {
                            setFoodRequirement(event.target)
                          }}
                          disabled={eventOption.value === 'webinar'}
                        />
                        <label className="form-check-label" for="yes">
                          No Special requirements
                        </label>
                      </div>
                      <div className="row ms-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={foodRequirement.name == 'No Pork' ? true : false}
                          name="No Pork"
                          onChange={event => {
                            setFoodRequirement(event.target)
                          }}
                          disabled={eventOption.value === 'webinar'}
                        />
                        <label className="form-check-label" for="no">
                          No Pork
                        </label>
                      </div>
                      <div className="row ms-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={foodRequirement.name == 'Vegetarian' ? true : false}
                          name="Vegetarian"
                          onChange={event => {
                            setFoodRequirement(event.target)
                          }}
                          disabled={eventOption.value === 'webinar'}
                        />
                        <label className="form-check-label" for="no">
                          Vegetarian
                        </label>
                      </div>
                      <div
                        className="row ms-0"
                        style={{
                          position: 'relative',
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
                          disabled={eventOption.value === 'webinar'}
                        />
                        <label className="form-check-label" for="no">
                          Other, please specify
                        </label>
                        {foodRequirement.name == 'Other, please specify' && (
                          <input
                            type="text"
                            className="form-control "
                            style={{ position: 'absolute', left: '200px', top: '-25%' }}
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
                <div style={{ padding: '20px 0px 20px 35px' }}>
                  <div
                    className="row"
                    style={{
                      paddingInlineStart: '2.8rem',
                      position: 'relative',
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
                    <label>
                      By signing up, you agree with{' '}
                      <span
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
                      </span>
                    </label>
                  </div>
                </div>
                <div
                  style={{
                    width: '80%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginLeft: '15px',
                    marginTop: '10px',
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
                      fontSize: '14px',
                      marginLeft: '20px',
                    }}
                  >
                    Register
                  </button>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '45%',
                    }}
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
        )}
      </div>

      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          ariaHideApp={false}
        >
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
              validation={() => {
                if (dependOnButton === 'agenda') {
                  return validateUrl(agendaMessage)
                } else if (dependOnButton === 'alink') {
                  return validateUrl(alinkMessage)
                } else if (dependOnButton === 'blink') {
                  return validateUrl(blinkMessage)
                }
              }}
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
              onCancel={() => {
                if (dependOnButton == 'agenda') {
                  setAgendaMessage('')
                } else if (dependOnButton == 'alink') {
                  setAlinkMessage('')
                } else if (dependOnButton == 'blink') {
                  setBlinkMessage('')
                }
              }}
              closeModal={closeModal}
              handleSendButton={closeModal}
            />
          )}
        </Modal>
      </div>
    </>
  )
}

export default AddEventScreen
