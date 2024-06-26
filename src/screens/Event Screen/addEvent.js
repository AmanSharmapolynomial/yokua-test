import React, { useEffect, useRef, useState } from 'react'
import Table from 'react-bootstrap/Table'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
const moment = require('moment')
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import 'react-datepicker/dist/react-datepicker.css'
import { FormControl } from 'react-bootstrap'
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
import CommonModal from '../../components/Modals/CommonModal/CommonModal'
import { useLoading } from '../../utils/LoadingContext'
import Tooltip from '@mui/material/Tooltip'

const AddEventScreen = () => {
  const navigate = useNavigate()
  const { setLoading } = useLoading()
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
  const [agendaFile, setAgendaFile] = useState(null)
  const [linkAFile, setLinkAFile] = useState(null)
  const [linkBFile, setLinkBFile] = useState(null)
  const [linkAName, setLinkAName] = useState('')
  const [linkBName, setLinkBName] = useState('')

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

  const linkStyles = {
    boxShadow: '0 0 0.313rem #00000035',
    width: 'max-content',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    padding: '0.25rem 0.4rem',
    borderRadius: '3px',
    marginRight: '1rem',
  }

  const handleSaveFile = file => {
    //console.log(file)
    dependOnButton === 'agenda'
      ? setAgendaFile(file)
      : dependOnButton === 'alink'
      ? setLinkAFile(file)
      : setLinkBFile(file)
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
          setLinkAName(result.links['link_a'].name)
          setLinkBName(result.links['link_b'].name)
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
    if (eventId) handleUpdateLinkNameFromModal()
  }

  //handle publish event
  const handlePublishButton = async event => {
    event.preventDefault()
    setLoading(true)
    let formData = new FormData()
    const preparedRequirementList = Object.values(requirement)
    preparedRequirementList.sort((a, b) => a.id - b.id)

    const data = {
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
        agenda_link: 'agenda',
        link_a: linkAName,
        link_b: linkBName,
      },
      requirements: preparedRequirementList.map(item => item.value),
    }
    formData.append('data', JSON.stringify(data))

    formData.append('agenda', agendaFile)
    formData.append('link_a', linkAFile)
    formData.append('link_b', linkBFile)

    for (var [key, value] of formData.entries()) {
      console.log(key, value)
    }
    // //console.log('called api: ' + JSON.stringify(eventObject))
    await API.post('training/training_addition', formData)
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
    setLoading(false)
  }

  const handleRegisterButton = async () => {
    if (eventOption.value !== 'webinar') {
      if (
        hotelReservation?.name === undefined
        // shuttleTransport?.name === undefined ||
        // foodRequirement?.name === undefined
      ) {
        toast.error('Hotel reservation preference is mandatory')
        return
      }
      if (
        // hotelReservation?.name === undefined ||
        shuttleTransport?.name === undefined
        // foodRequirement?.name === undefined
      ) {
        toast.error('Shuttle transport preference is mandatory')
        return
      }
      if (
        // hotelReservation?.name === undefined ||
        // shuttleTransport?.name === undefined ||
        foodRequirement?.name === undefined
      ) {
        toast.error('Food preference is mandatory')
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

  const updateEvent = async editFileState => {
    if (!agendaFile && dependOnButton == 'agenda') {
      toast.error('Agenda cannot be empty')
      return
    }
    setLoading(true)
    let formData = new FormData()
    const data = {
      event_id: eventId,
      agenda: 'Agenda',
      link_a: linkAName,
      link_b: linkBName,
      delete_link_a: editFileState && dependOnButton == 'alink',
      delete_link_b: editFileState && dependOnButton == 'blink',
    }
    formData.append('data', JSON.stringify(data))
    if (agendaFile) formData.append('agenda', agendaFile)
    if (linkAFile) formData.append('link_a', linkAFile)
    if (linkBFile) formData.append('link_b', linkBFile)

    //console.log("FORM DATA", formData)
    await API.post('/training/update_event', formData)
      .then(data => {
        if (data.status == 200 || data.status == 201) {
          toast.success(data.data.message)
          setAgendaFile(null)
          setLinkAFile(null)
          setLinkBFile(null)
          getEventDetailById(eventId)
        } else {
          toast.error(data.data.message)
        }
      })
      .catch(err => {
        toast.error(err)
      })
    setLoading(false)
  }

  const handleUpdateLinkNameFromModal = () => {
    if (dependOnButton == 'alink') {
      setLinkAName(alinkMessage.name)
    } else if (dependOnButton == 'blink') {
      setLinkBName(blinkMessage.name)
    } else {
      return
    }
  }

  useEffect(() => {
    const msPerDay = 1000 * 60 * 60 * 24
    let days = Math.round((endDate.getTime() - startDate.getTime()) / msPerDay) + 1
    console.log('DURATION', days)
    setDuration(days)
  }, [startDate, endDate])

  return (
    <>
      <Header isLogedIn={getToken()} />
      <div className="row mx-2 mx-lg-5 h-100">
        <div className="profile-setting-container col center py-3">
          <PrimaryHeading title="RYG Event Calendar" backgroundImage={'yk-back-image-event'} />
          <div className="col">
            <div className="row py-3">
              <div className="col shadow rounded-3">
                <h4 className="mt-4 clamp-2v">Rota Yokogawa Training and Events</h4>
                <div className="row">
                  <form className="col-lg-6 pe-4 pe-lg-0" id="trainingRegForm">
                    <div className="row d-flex align-items-center mt-4">
                      <label style={{ fontWeight: 'bold' }} className="col my-auto clamp-1v">
                        Training Name
                      </label>
                      <input
                        type="text"
                        disabled={eventId}
                        className="form-control col clamp-1v"
                        onChange={event => {
                          setTrainingName(event.target.value)
                        }}
                        name="training_name"
                        value={trainingName}
                      />
                    </div>
                    <div className="row d-flex align-items-center mt-4">
                      <label style={{ fontWeight: 'bold' }} className="col my-auto clamp-1v">
                        Start date
                      </label>
                      <div className="col">
                        <div className="row">
                          <DatePicker
                            wrapperClassName="p-0"
                            calendarStartDay={1}
                            minDate={new Date()}
                            className="form-control clamp-1v"
                            onChange={date => {
                              if (endDate != null && endDate != undefined && endDate >= date) {
                                // setDuration(
                                //   moment(endDate).diff(date, 'days') === 0
                                //     ? 1
                                //     : moment(endDate).diff(date, 'days')
                                // )
                                setStartDate(date)
                              } else {
                                // setDuration(
                                //   moment(date).diff(date, 'days') === 0
                                //     ? 1
                                //     : moment(date).diff(date, 'days')
                                // )
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
                            className="calendar-icon w-auto p-0"
                            style={
                              eventId
                                ? { display: 'none' }
                                : {
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
                    </div>
                    <div className="row d-flex align-items-center mt-4">
                      <label style={{ fontWeight: 'bold' }} className="col my-auto clamp-1v">
                        End date
                      </label>
                      <div className="col">
                        <div className="row">
                          <DatePicker
                            wrapperClassName="p-0"
                            calendarStartDay={1}
                            minDate={startDate}
                            className="form-control clamp-1v"
                            onChange={date => {
                              setEndDate(date)
                              if (startDate != null || startDate != undefined) {
                                setDuration(
                                  moment(date).diff(startDate, 'days') === 0
                                    ? 1
                                    : moment(date).diff(startDate, 'days')
                                )
                              }
                            }}
                            placeholderText="DDMMYYYY"
                            dateFormat="dd/M/Y"
                            selected={endDate}
                            disabled={eventId}
                          />

                          <div
                            className="calendar-icon w-auto p-0"
                            style={
                              eventId
                                ? { display: 'none' }
                                : {
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
                    </div>
                    <div className="row d-flex align-items-center mt-4">
                      <label style={{ fontWeight: 'bold' }} className="col my-auto clamp-1v">
                        Cancellation Date
                      </label>
                      <div className="col">
                        <div className="row">
                          <DatePicker
                            wrapperClassName="p-0"
                            calendarStartDay={1}
                            minDate={new Date()}
                            maxDate={moment(startDate).subtract(1, 'day').toDate()}
                            className="form-control clamp-1v"
                            onChange={date => {
                              if (moment(date).isBefore(startDate)) {
                                setCancelledDate(date)
                              } else {
                                toast.error(
                                  'Start date should be earlier than registration deadline'
                                )
                              }
                            }}
                            placeholderText="DDMMYYYY"
                            dateFormat="dd/M/Y"
                            selected={cancelledDate}
                            disabled={eventId}
                          />
                          <div
                            className="calendar-icon w-auto p-0"
                            style={
                              eventId
                                ? { display: 'none' }
                                : {
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
                    </div>
                    <div className="row d-flex align-items-center mt-4">
                      <label style={{ fontWeight: 'bold' }} className="col my-auto clamp-1v">
                        Duration
                      </label>
                      <input
                        type="number"
                        className="form-control col clamp-1v"
                        onChange={event => {
                          setDuration(event.target.value)
                        }}
                        disabled
                        value={duration}
                      />
                    </div>
                    <div className="row d-flex align-items-center mt-4">
                      <label style={{ fontWeight: 'bold' }} className="col my-auto clamp-1v">
                        Costs
                      </label>
                      <input
                        type="text"
                        step=".01"
                        presicion={2}
                        className="form-control hide-spinners col clamp-1v"
                        onChange={event => {
                          //console.log()
                          // let value = event.target.value.match(/\d+/)?.join('')
                          setCost(event.target.value)
                        }}
                        value={cost}
                        disabled={eventId}
                      />
                    </div>
                    <div className="row d-flex align-items-center mt-4">
                      <label style={{ fontWeight: 'bold' }} className="col my-auto clamp-1v">
                        Location
                      </label>
                      <textarea
                        rows="3"
                        cols="30"
                        className="form-control col clamp-1v"
                        onChange={event => {
                          setLocation(event.target.value)
                        }}
                        value={location}
                        disabled={eventId}
                      />
                    </div>
                    <div className="row d-flex align-items-center mt-4">
                      <label style={{ fontWeight: 'bold' }} className="col my-auto clamp-1v">
                        Type of Events
                      </label>
                      <div className="col">
                        <Select
                          className="select-box row clamp-1v"
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
                    <div className="row d-flex align-items-center mt-4">
                      <div className="col">
                        <div
                          className="row d-flex align-items-center"
                          style={
                            eventOption.value == 'webinar'
                              ? {
                                  pointerEvents: 'none',
                                  opacity: '0.4',
                                  userSelect: 'none',
                                }
                              : {}
                          }
                        >
                          {isAdmin && (
                            <>
                              <label
                                style={{ fontWeight: 'bold' }}
                                className="col my-auto clamp-1v"
                              >
                                Max attendees
                              </label>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="col">
                        <div className="row d-flex align-items-center">
                          <div className="col-3 row">
                            <input
                              type="text"
                              className="form-control clamp-1v"
                              pattern="[0-9]"
                              onChange={event => {
                                let value = +event.target.value || 0
                                setMaxAttendeed(value)
                                setRemainSeats(value)
                              }}
                              onBlur={event => {
                                if (remainSeat && remainSeat > maxAttendacees) {
                                  toast.error(
                                    'Remaining seats can not be greater than max. attendees'
                                  )
                                }
                              }}
                              value={eventOption.value == 'webinar' ? '' : maxAttendacees}
                              disabled={eventId || eventOption.value == 'webinar'}
                            />
                          </div>

                          <label
                            style={
                              eventOption.value == 'webinar'
                                ? {
                                    pointerEvents: 'none',
                                    opacity: '0.4',
                                    userSelect: 'none',
                                    fontWeight: 'bold',
                                  }
                                : {
                                    fontWeight: 'bold',
                                  }
                            }
                            className="col-auto ms-auto my-auto clamp-1v"
                          >
                            Remaining Seats
                          </label>
                          <div className="col-3 row">
                            <input
                              type="text"
                              className="form-control clamp-1v"
                              pattern="[0-9]"
                              onChange={event => {
                                //console.log()
                                let value = Number(event.target.value.match(/\d+/)?.join(''))
                                setRemainSeats(value)
                              }}
                              onBlur={event => {
                                if (maxAttendacees != remainSeat) {
                                  toast.error(
                                    'Max attendees and remaining attendees should be the same'
                                  )
                                  setRemainSeats(0)
                                }
                              }}
                              value={eventOption.value == 'webinar' ? '' : remainSeat}
                              disabled={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row d-flex align-items-center mt-4">
                      <label style={{ fontWeight: 'bold' }} className="col clamp-1v">
                        Classification level
                      </label>
                      <div className="col">
                        <Select
                          className="select-box row clamp-1v"
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
                    <div
                      className="row d-flex align-items-center mt-4"
                      style={{
                        marginLeft: '0.2rem',
                        //justifyContent: 'space-between'
                      }}
                    >
                      {/* <div className='col'> */}
                      <div className="col-12 col-lg-auto" style={linkStyles}>
                        <Tooltip
                          title={
                            agendaFile != null || (agendaMessage != '' && agendaMessage.link != '')
                              ? 'Download File'
                              : 'No file added'
                          }
                        >
                          <button
                            className="px-2 py-1 rounded-3 clamp-08v"
                            style={{
                              background:
                                agendaFile != null ||
                                (agendaMessage != '' && agendaMessage.link != '')
                                  ? 'rgb(0, 79, 155)'
                                  : 'grey',
                              color: 'white',
                              border: '1px solid black',
                              cursor: eventId && agendaMessage.link ? 'pointer' : 'initial',
                            }}
                            onClick={event => {
                              event.preventDefault()
                              if (eventId) {
                                if (agendaMessage.link)
                                  window.open(agendaMessage.link + `?token=${getToken()}`, '_blank')
                                else toast.error('No Link Added')
                              }
                              // if (!eventId && isAdmin) {
                              //   setDependOnButton('agenda')
                              //   setLinkModal(true)
                              //   openModal(event)
                              // } else {
                              //   event.preventDefault()
                              //   window.open(agendaMessage.link, '_blank')
                              // }
                            }}
                          >
                            Agenda
                          </button>
                        </Tooltip>
                        {isAdmin ? <div>&nbsp;&nbsp;</div> : null}
                        {isAdmin && (
                          <Tooltip title="Edit File">
                            <i
                              className="fa-solid fa-pen-to-square theme"
                              style={{
                                fontSize: 'small',
                                alignSelf: 'center',
                                margin: 0,
                                cursor: 'pointer',
                              }}
                              onClick={event => {
                                setDependOnButton('agenda')
                                setLinkModal(true)
                                openModal(event)
                              }}
                            ></i>
                          </Tooltip>
                        )}
                      </div>
                      {/* </div> */}
                      {/* <div className='col'> */}
                      {eventId && !isAdmin && !alinkMessage.link ? null : (
                        <div className="col-12 col-lg-auto" style={linkStyles}>
                          <Tooltip
                            title={
                              linkAFile != null || (alinkMessage != '' && alinkMessage.link != '')
                                ? 'Download File'
                                : 'No file added'
                            }
                          >
                            <button
                              className="px-2 py-1 rounded-3 clamp-08v"
                              style={{
                                background:
                                  linkAFile != null ||
                                  (alinkMessage != '' && alinkMessage.link != '')
                                    ? 'rgb(0, 79, 155)'
                                    : 'grey',
                                color: 'white',
                                border: '1px solid black',
                                cursor: eventId && alinkMessage.link ? 'pointer' : 'initial',
                              }}
                              onClick={event => {
                                event.preventDefault()
                                if (eventId) {
                                  if (alinkMessage.link)
                                    window.open(
                                      alinkMessage.link + `?token=${getToken()}`,
                                      '_blank'
                                    )
                                  else toast.error('No Link Added')
                                }
                                // if (!eventId && isAdmin) {
                                //   setDependOnButton('alink')
                                //   setLinkModal(true)
                                //   openModal(event)
                                // } else {
                                //   event.preventDefault()
                                //   if (alinkMessage.link) window.open(alinkMessage.link, '_blank')
                                //   else toast.error('No Link Added')
                                // }
                              }}
                            >
                              {eventId
                                ? alinkMessage.name
                                  ? alinkMessage.name
                                  : 'Other Possible Link A'
                                : linkAName
                                ? linkAName
                                : 'Other Possible link A'}
                            </button>
                          </Tooltip>
                          {isAdmin ? <div>&nbsp;&nbsp;</div> : null}
                          {isAdmin && (
                            <Tooltip title="Edit File">
                              <i
                                className="fa-solid fa-pen-to-square theme"
                                style={{
                                  fontSize: 'small',
                                  alignSelf: 'center',
                                  margin: 0,
                                  cursor: 'pointer',
                                }}
                                onClick={event => {
                                  setDependOnButton('alink')
                                  setLinkModal(true)
                                  openModal(event)
                                }}
                              ></i>
                            </Tooltip>
                          )}
                        </div>
                      )}
                      {/* </div> */}
                      {/* <div className='col'> */}
                      {eventId && !isAdmin && !blinkMessage.link ? null : (
                        <div className="col-12 col-lg-auto" style={linkStyles}>
                          <Tooltip
                            title={
                              linkBFile != null || (blinkMessage != '' && blinkMessage.link != '')
                                ? 'Download File'
                                : 'No file added'
                            }
                          >
                            <button
                              className="px-2 py-1 rounded-3 clamp-08v"
                              style={{
                                background:
                                  linkBFile != null ||
                                  (blinkMessage != '' && blinkMessage.link != '')
                                    ? 'rgb(0, 79, 155)'
                                    : 'grey',
                                color: 'white',
                                border: '1px solid black',
                                cursor: eventId && blinkMessage.link ? 'pointer' : 'initial',
                              }}
                              onClick={event => {
                                event.preventDefault()
                                if (eventId) {
                                  if (blinkMessage.link)
                                    window.open(
                                      blinkMessage.link + `?token=${getToken()}`,
                                      '_blank'
                                    )
                                  else toast.error('No Link Added')
                                }
                                // if (!eventId && isAdmin) {
                                //   setDependOnButton('blink')
                                //   setLinkModal(true)
                                //   openModal(event)
                                // } else {
                                //   event.preventDefault()
                                //   if (blinkMessage.link) window.open(blinkMessage.link, '_blank')
                                //   else toast.error('No Link Added')
                                // }
                              }}
                            >
                              {eventId
                                ? blinkMessage.name
                                  ? blinkMessage.name
                                  : 'Other Possible Link B'
                                : linkBName
                                ? linkBName
                                : 'Other Possible link B'}
                            </button>
                          </Tooltip>
                          {isAdmin ? <div>&nbsp;&nbsp;</div> : null}
                          {isAdmin && (
                            <Tooltip title="Edit File">
                              <i
                                className="fa-solid fa-pen-to-square theme"
                                style={{
                                  fontSize: 'small',
                                  alignSelf: 'center',
                                  margin: 0,
                                  cursor: 'pointer',
                                }}
                                onClick={event => {
                                  setDependOnButton('blink')
                                  setLinkModal(true)
                                  openModal(event)
                                }}
                              ></i>
                            </Tooltip>
                          )}
                        </div>
                      )}
                      {/* </div> */}
                    </div>

                    <div className="mt-4">
                      <h4 className="clamp-2v">Requirements for the event</h4>
                      <ul className="requirements-list">
                        {!eventId
                          ? Object.entries(requirement).map(([key, e]) => {
                              return (
                                <li key={key}>
                                  {e.isEditing ? (
                                    <input
                                      className="clamp-1v"
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
                            <div
                              className="d-flex"
                              onClick={() => {
                                setMoreInputFlag(!moreInputFlag)
                              }}
                            >
                              <i
                                style={{ color: 'rgb(0, 79, 155)' }}
                                className="fa-solid fa-circle-plus"
                              />
                              <span className="ms-2 clamp-1v">more</span>
                            </div>
                          ) : (
                            <div
                              style={{
                                display: 'flex',
                              }}
                            >
                              <div>
                                <input
                                  type="text"
                                  className="form-control clamp-1v"
                                  onChange={event => {
                                    setSingleRequirement(event.target.value)
                                  }}
                                  value={singleRequirement}
                                />
                              </div>
                              <div className="btn-group">
                                <button
                                  className="px-2 py-1 rounded-3 ms-2 clamp-08v"
                                  style={{
                                    background: 'rgb(0, 79, 155)',
                                    color: 'white',
                                    border: '1px solid black',
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
                                  className="px-2 py-1 rounded-3 ms-2 clamp-08v"
                                  style={{
                                    background: 'rgb(0, 79, 155)',
                                    color: 'white',
                                    border: '1px solid black',
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
                        <div className="my-4">
                          <button
                            className="px-2 py-1 rounded-3 clamp-08v"
                            onClick={event => {
                              handlePublishButton(event)
                            }}
                            style={{
                              background: 'rgb(0, 79, 155)',
                              color: 'white',
                              border: '1px solid black',
                            }}
                          >
                            Publish
                          </button>
                        </div>
                      )}
                    </div>
                  </form>

                  <div className="mt-4 mb-4 mt-lg-0 mb-lg-0 col-lg-6">
                    <textarea
                      style={{ maxHeight: '32rem' }}
                      rows="8"
                      // cols="30"
                      placeholder="Enter description..."
                      className="form-control w-lg-75 float-lg-right mt-4 clamp-1v"
                      onChange={event => {
                        setDescription(event.target.value)
                      }}
                      value={description}
                      disabled={eventId}
                    />
                  </div>
                </div>
              </div>

              {eventId && (
                <div className="mt-4 shadow rounded">
                  <div className="mt-4">
                    {eventId ? (
                      <h4 className="mt-4 clamp-2v">Register for {trainingName}</h4>
                    ) : (
                      <h4 className="mt-4 clamp-2v">Register for Trainings</h4>
                    )}
                    <div className="row">
                      <form className="col-12 col-lg-4">
                        <div className="row d-flex align-items-center mt-4">
                          <div className="col">
                            <Select
                              className="select-box clamp-1v"
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
                        <div className="row d-flex align-items-center mt-4">
                          <div className="col">
                            <input
                              type="text"
                              placeholder="First Name"
                              className="form-control clamp-1v"
                              value={firstName}
                              disabled={eventId && registerationType.value == 'internal'}
                              onChange={event => {
                                setFirstName(event.target.value)
                              }}
                            />
                          </div>
                        </div>
                        <div className="row d-flex align-items-center mt-4">
                          <div className="col">
                            <input
                              type="text"
                              placeholder="Last Name"
                              className="form-control clamp-1v"
                              value={lastName}
                              disabled={eventId && registerationType.value == 'internal'}
                              onChange={event => {
                                setLastName(event.target.value)
                              }}
                            />
                          </div>
                        </div>
                        <div className="row d-flex align-items-center mt-4">
                          <div className="col">
                            <input
                              type="email"
                              placeholder="Company E-Mail ID"
                              className="form-control clamp-1v"
                              style={{ textTransform: 'lowercase' }}
                              value={companyEmail}
                              disabled={eventId && registerationType.value == 'internal'}
                              onChange={event => {
                                setCompanyEmail(event.target.value.toLowerCase())
                              }}
                              required
                            />
                          </div>
                        </div>
                        <div className="row d-flex align-items-center mt-4">
                          <div className="col">
                            <input
                              type="text"
                              placeholder="Company "
                              className="form-control clamp-1v"
                              value={companyName}
                              disabled={eventId && registerationType.value == 'internal'}
                              onChange={event => {
                                setCompanyName(event.target.value)
                              }}
                            />
                          </div>
                        </div>
                        <div className="row d-flex align-items-center mt-4">
                          <div className="col">
                            <label style={{ fontWeight: 'bold' }} className="clamp-1v">
                              Hotel reservation required
                            </label>
                          </div>
                        </div>

                        <div className="row d-flex align-items-center">
                          <div className="col">
                            <div className="form-check form-check-inline d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input clamp-1v"
                                checked={hotelReservation.name == 'hotelYes' ? true : false}
                                name="hotelYes"
                                onChange={event => {
                                  setHotelReservation(event.target)
                                }}
                                disabled={eventOption.value === 'webinar'}
                              />
                              <label className="form-check-label m-0 clamp-1v" for="yes">
                                Yes
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="row d-flex align-items-center">
                          <div className="col">
                            <div className="form-check form-check-inline d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input clamp-1v"
                                checked={hotelReservation.name == 'hotelNo' ? true : false}
                                name="hotelNo"
                                onChange={event => {
                                  setHotelReservation(event.target)
                                }}
                                disabled={eventOption.value === 'webinar'}
                              />
                              <label className="form-check-label m-0 clamp-1v" for="no">
                                No
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="row d-flex align-items-center mt-4">
                          <div className="col">
                            <label style={{ fontWeight: 'bold' }} className="clamp-1v">
                              Assist with organization of shuttle transport
                            </label>
                          </div>
                        </div>
                        <div className="row d-flex align-items-center">
                          <div className="col">
                            <div className="form-check form-check-inline d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input clamp-1v"
                                checked={shuttleTransport.name == 'shuttleYes' ? true : false}
                                name="shuttleYes"
                                onChange={event => {
                                  setShuttleTransport(event.target)
                                }}
                                disabled={eventOption.value === 'webinar'}
                              />
                              <label className="form-check-label m-0 clamp-1v" for="yes">
                                Yes
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="row d-flex align-items-center">
                          <div className="col">
                            <div className="form-check form-check-inline d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input clamp-1v"
                                checked={shuttleTransport.name == 'shuttleNo' ? true : false}
                                name="shuttleNo"
                                onChange={event => {
                                  setShuttleTransport(event.target)
                                }}
                                disabled={eventOption.value === 'webinar'}
                              />
                              <label className="form-check-label m-0 clamp-1v" for="no">
                                No
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="row d-flex align-items-center mt-4">
                          <div className="col">
                            <label style={{ fontWeight: 'bold' }} className="clamp-1v">
                              Special food requirement
                            </label>
                          </div>
                        </div>
                        <div className="row d-flex align-items-center">
                          <div className="col">
                            <div className="form-check form-check-inline d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input clamp-1v"
                                checked={foodRequirement.name == 'No Requirement' ? true : false}
                                name="No Requirement"
                                onChange={event => {
                                  setFoodRequirement(event.target)
                                }}
                                disabled={eventOption.value === 'webinar'}
                              />
                              <label className="form-check-label m-0 clamp-1v" for="yes">
                                No Special requirements
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="row d-flex align-items-center">
                          <div className="col">
                            <div className="form-check form-check-inline d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input clamp-1v"
                                checked={foodRequirement.name == 'No Pork' ? true : false}
                                name="No Pork"
                                onChange={event => {
                                  setFoodRequirement(event.target)
                                }}
                                disabled={eventOption.value === 'webinar'}
                              />
                              <label className="form-check-label m-0 clamp-1v" for="no">
                                No Pork
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="row d-flex align-items-center">
                          <div className="col">
                            <div className="form-check form-check-inline d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input clamp-1v"
                                checked={foodRequirement.name == 'Vegetarian' ? true : false}
                                name="Vegetarian"
                                onChange={event => {
                                  setFoodRequirement(event.target)
                                }}
                                disabled={eventOption.value === 'webinar'}
                              />
                              <label className="form-check-label m-0 clamp-1v" for="no">
                                Vegetarian
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="row d-flex align-items-center">
                          <div className="col">
                            <div className="form-check form-check-inline d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input clamp-1v"
                                checked={
                                  foodRequirement.name == 'Other, please specify' ? true : false
                                }
                                name="Other, please specify"
                                onChange={event => {
                                  setFoodRequirement(event.target)
                                }}
                                disabled={eventOption.value === 'webinar'}
                              />
                              <label className="form-check-label m-0 clamp-1v" for="no">
                                Other, please specify
                              </label>
                            </div>
                            {foodRequirement.name == 'Other, please specify' && (
                              <input
                                type="text"
                                className="form-control clamp-1v"
                                value={otherFoodRequirement}
                                onChange={event => {
                                  setOtherFoodRequirement(event.target.value)
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                    <div style={{ height: '1rem' }} />
                    <div className="row">
                      <div>
                        <div className="row d-flex align-items-center">
                          <div className="col-12 col-md">
                            <div className="form-check form-check-inline d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input clamp-1v"
                                checked={termsPolicy}
                                onChange={() => {
                                  setTermPolicy(!termsPolicy)
                                }}
                              />
                              <label className="m-0 clamp-1v">
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
                          <div className="col-12 col-md mt-4 mt-lg-0">
                            <div className="row d-flex align-items-center">
                              <label
                                style={{ fontWeight: 'bold' }}
                                className="col my-auto clamp-1v"
                              >
                                Registration can be cancelled until
                              </label>
                              <div className="col">
                                <div className="row">
                                  <DatePicker
                                    disabled
                                    minDate={new Date()}
                                    className="form-control clamp-1v"
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
                      <div className="my-4">
                        <button
                          className="px-2 py-1 rounded-3 clamp-08v"
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
                          }}
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CommonModal
        action="fileUpload"
        show={modalIsOpen}
        handleClose={closeModal}
        modalTitle={
          dependOnButton === 'agenda'
            ? 'Upload Agenda'
            : dependOnButton === 'alink'
            ? 'Other possible link A'
            : 'Other possible link B'
        }
        data={''}
        handleDataChange={null}
        cancelAction={closeModal}
        saveAction={eventId ? updateEvent : handleSaveFile}
        propFile={
          dependOnButton === 'agenda'
            ? agendaFile
            : dependOnButton === 'alink'
            ? linkAFile
            : linkBFile
        }
        register={eventId ? true : false}
        uploadedFileLink={
          eventId
            ? dependOnButton === 'agenda'
              ? agendaMessage.link
              : dependOnButton === 'alink'
              ? alinkMessage.link
              : blinkMessage.link
            : ''
        }
        editFile={
          dependOnButton === 'agenda'
            ? setAgendaFile
            : dependOnButton === 'alink'
            ? setLinkAFile
            : setLinkBFile
        }
        editLinkName={handleUpdateLinkNameFromModal}
      >
        {dependOnButton === 'agenda' ? (
          <></>
        ) : (
          <>
            <FormControl
              style={{ fontSize: 'small', border: '1px solid gray' }}
              className="w-100"
              placeholder={'Name'}
              aria-label={'Name'}
              aria-describedby="basic-addon2"
              value={
                // eventId ? (
                //   dependOnButton === 'alink' ? alinkMessage.name : blinkMessage.name
                // ) : (
                //   dependOnButton === 'alink' ? linkAName : linkBName
                // )
                dependOnButton === 'alink' ? linkAName : linkBName
              }
              onChange={e => {
                dependOnButton === 'alink'
                  ? setLinkAName(e.target.value)
                  : setLinkBName(e.target.value)
              }}
            />
            <br />
          </>
        )}
      </CommonModal>

      {/* <Modal
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
      </Modal> */}
    </>
  )
}

export default AddEventScreen
