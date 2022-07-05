import React, { useEffect, useRef, useState } from 'react'
import './style.css'
import PrimaryHeading from '../../components/Primary Headings'
import moment from 'moment'
import API from '../../utils/api'
import { getToken, getUserRoles, removeToken, removeUserRole } from '../../utils/token'
import { toast } from 'react-toastify'
import DeleteModal from '../../components/Modals/Delete Modal/DeleteModal'
import validator from 'validator'
import CustomCheckbox from '../../components/Profile/CustomCheckbox'
import Header from '../../components/Header'
import { useNavigate } from 'react-router'
import placeholder from '../../components/News Components/placeholder.png'
import { useLoading } from '../../utils/LoadingContext'
import Modal from 'react-modal'
import { Modal as BSModal } from 'react-bootstrap'
import CustomDropdown from '../../components/Sign Up/CustomDropdown'
const customStyles = {
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

const cancelModalStyle = {
  overlay: {
    zIndex: 15,
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

const ProfileSettingScreen = () => {
  const { setLoading } = useLoading()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalLoading, setIsModalLoading] = useState(false)
  const [isModalSubmitting, setIsModalSubmitting] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState({})
  const [viewMore, setViewMore] = useState(false)
  const [profileData, setProfileData] = useState({})
  const [name, setName] = useState()
  const nameRef = useRef()
  const [email, setEmail] = useState()
  const emailRef = useRef()
  const [address, setAddress] = useState('')
  const [comp, setComp] = useState('')
  const [password, setPassword] = useState()
  const [passwordRetype, setPasswordRetype] = useState()
  const [disabledInputName, setDisabledInputName] = useState(true)
  const [disabledInputEmail, setDisabledInputEmail] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [disabledInputAddress, setDisabledInputAddress] = useState(true)

  const [editMode1, setEditMode1] = useState(false)
  const [editMode2, setEditMode2] = useState(false)

  const [openSimpleDeleteModal, setOpenSimpleDeleteModal] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordVisible2, setPasswordVisible2] = useState(false)

  // const addressRef = useRef()

  const [checkedIds, setCheckedIds] = useState([])
  const [reloadData, setReloadData] = useState(false)

  const imageFileInputRef = useRef()
  const [profilePicture, setProfilePicture] = useState(placeholder)
  const [actionLabel, setActionLabel] = useState('')
  const alertRef = useRef()
  const navigate = useNavigate()
  const [category, setCategory] = useState([])
  const [topicName, setTopicName] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('Company')

  const getCompanyList = () => {
    API.get('auth/view_company').then(data => {
      setCategory(data.data)
    })
  }
  const handleSelectTopic = cat => {
    setAddress(cat)
    setSelectedTopic(cat)
  }
  const getSelectedCompany = name => {
    handleSelectTopic(name)
  }

  // useEffect(() => {
  //   console.log("ADDRESS-REF", addressRef)
  // }, [disabledInputAddress])

  useEffect(() => {
    getCompanyList()
  }, [])

  useEffect(async () => {
    // call profile data
    setIsLoading(true)
    setLoading(true)
    const backendData = await API.get('/auth/profile_settings/')
    setProfileData(backendData.data)
    setAddress(backendData.data.basic_profile.company_name)
    _setProfilePicture(
      backendData.data.basic_profile?.avatar ? backendData.data.basic_profile?.avatar : placeholder
    )
    setIsLoading(false)
    setLoading(false)
  }, [reloadData])

  useEffect(() => {
    const name = profileData.basic_profile?.full_name || 'chael'
    const formattedName = capitalizeName(name)
    nameRef.current.value = formattedName
    emailRef.current.value = profileData.basic_profile?.email || 'tech@yokogawa.com'
    //addressRef.current.value = profileData.basic_profile?.company_name
    setAddress(profileData.basic_profile?.company_name)
    const tempCheckedArr = []
    profileData.news_letter?.map((nl, index) => {
      if (nl.subscribed) {
        const checkedPayload = {
          id: nl.id,
          news_letter_title: nl.news_letter_title,
          subscribed: true,
        }
        tempCheckedArr.push(checkedPayload)
      }
    })
    setCheckedIds(tempCheckedArr)
  }, [profileData])

  const saveAndExit = () => {
    setOpenSimpleDeleteModal(false)
    document.body.style.overflow = 'auto'
    setReloadData(!reloadData)
  }

  const runDeleteAccount = async email => {
    const payloadDeleteAccount = {
      email: [email],
    }
    // /admin/delete_user
    const afterDeleteMsg = await API.post('/admin/delete_user', payloadDeleteAccount)
    removeToken()
    removeUserRole()
    window.location.reload()
  }

  const _updateAvatar = image => {
    const formData = new FormData()
    formData.append('image', image)
    API.post('auth/update_avatar', formData)
      .then(data => {
        toast.success('Avatar updated successfully')
        setReloadData(!reloadData)
        navigate(0)
      })
      .catch(error => {})
  }

  const _setProfilePicture = avatar => {
    setProfilePicture(avatar)
  }

  const handleModalClose = () => {
    setSelectedEvent({})
    setIsModalLoading(false)
    setIsModalSubmitting(false)
    setShowCancelModal(false)
    setIsModalOpen(false)
  }

  const fetchEventData = (event_id, email, type) => {
    setIsModalLoading(true)
    API.post('training/get_user_preference', {
      event_id,
      email,
    })
      .then(res => {
        if (res.status === 200) {
          setSelectedEvent({
            ...res.data,
            event_id,
            email,
            type,
            isOtherSelected: !(
              res.data?.food_requirements === 'No Requirement' ||
              res.data?.food_requirements === 'No Pork' ||
              res.data?.food_requirements === 'Vegetarian'
            ),
          })
        }
      })
      .finally(() => {
        setIsModalLoading(false)
      })
  }

  const handleEventUpdate = (e, shouldCancel = false) => {
    e.preventDefault()
    if (selectedEvent.isOtherSelected && selectedEvent.food_requirements === '') {
      toast.error('Please specify food requirement')
      return
    }
    setIsModalSubmitting(true)
    API.post('/auth/update_event_preferences/', {
      id: selectedEvent.event_id,
      participant_email: selectedEvent.email,
      cancel: shouldCancel,
      preferences: {
        hotel_reservation: selectedEvent.hotel_reservation,
        shuttle_transport: selectedEvent.shuttle_transport,
        food_requirements: selectedEvent.food_requirements,
      },
    })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message || 'Event preferences updated successfully')
        } else {
          throw new Error(res.data.message || 'Event preferences update failed')
        }
      })
      .then(() => {
        if (shouldCancel) {
          setProfileData(prev => ({
            ...prev,
            future_trainings: prev.future_trainings.filter(
              training => training.event_id !== selectedEvent.event_id
            ),
          }))
        }
        handleModalClose()
      })
      .catch(e => {
        console.error(e)
        setIsModalSubmitting(false)
      })
  }
  const cancelEvent = e => {
    e.preventDefault()
    API.post('/training/delete_event_registeration', {
      event_id: selectedEvent.event_id,
      participant_email: selectedEvent.email,
    })
      .then(res => {
        setShowCancelModal(false)
        toast.success(res.message)
        setReloadData(!reloadData)
      })
      .catch(err => setShowCancelModal(false))
  }

  const capitalizeName = name => {
    let nameList = name.split(' ')
    nameList[0] = nameList[0].charAt(0).toUpperCase() + nameList[0].slice(1)
    if (nameList.length > 1) {
      let len = nameList.length
      nameList[len - 1] = nameList[len - 1].charAt(0).toUpperCase() + nameList[len - 1].slice(1)
    }
    const newName = nameList.join(' ')
    return newName
  }

  return (
    <>
      <Header isLogedIn={getToken()} />
      <div className="row mx-2 mx-lg-5 h-100">
        {openSimpleDeleteModal && (
          <DeleteModal
            show={openSimpleDeleteModal}
            setShow={setOpenSimpleDeleteModal}
            req={'your Account'}
            saveAndExit={saveAndExit}
            title={
              'This would delete your personal data permanently from our Flow Center Page, You will lose all access and any subscription will be canceled.'
            }
            runDelete={runDeleteAccount}
            data={profileData.basic_profile?.email}
          />
        )}
        <div className="col profile-setting-container pb-5 py-lg-3">
          <PrimaryHeading title={'Profile settings'} backgroundImage={'yk-back-image-profile'} />
          <div className="profile-setting col col-lg-10 p-0">
            <div className="profile-setting__info">
              <div>
                <input
                  accept="image/*"
                  type="file"
                  id="avatar"
                  ref={imageFileInputRef}
                  className="inputfile yk-icon-hover"
                  onChange={e => {
                    _updateAvatar(e.target.files[0])
                  }}
                />
                <img
                  key={profilePicture}
                  className="profile-setting__info_img"
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => imageFileInputRef.current.click()}
                  src={profilePicture}
                  onError={() => setProfilePicture(placeholder)}
                />
              </div>

              <div className="profile-setting__info_name">
                <h4 className="name">{profileData.basic_profile?.full_name}</h4>
                <p className="details">
                  {`FCP user since ${moment(profileData.basic_profile?.date_joined).format(
                    'MMM Do YYYY'
                  )}`}{' '}
                </p>
              </div>
            </div>

            <div className="profile-setting__basic-profile profile-setting__box">
              <h1 className="profile-setting__heading py-3">BASIC PROFILE</h1>
              <div className="profile-setting__basic-profile-edit">
                <div className="edit_input">
                  <img
                    style={{ width: '20px', height: '20px' }}
                    src={require('../../assets/Icon ionic-ios-person.png')}
                  />
                  <input
                    // autoCapitalize="word"
                    required
                    type="text"
                    disabled={disabledInputName}
                    autoFocus={disabledInputName}
                    ref={nameRef}
                    onChange={e => {
                      setEditMode1(true)
                      const name = e.target.value
                      setName(capitalizeName(name))
                    }}
                  />
                  {getUserRoles() == 'Technical Administrator' ? (
                    <></>
                  ) : (
                    <i
                      className="fa-solid fa-pen-to-square edit"
                      style={{
                        color: disabledInputName ? 'var(--bgColor2)' : 'grey',
                      }}
                      onClick={() => {
                        console.log('NAMEREF', nameRef)
                        setDisabledInputName(!disabledInputName)
                        nameRef.focus()
                      }}
                    />
                  )}
                </div>
                <div className="edit_input">
                  <img
                    style={{ width: '20px', height: '15px' }}
                    src={require('../../assets/Icon zocial-email.png')}
                  />
                  <input
                    style={{ textTransform: 'lowercase' }}
                    type="email"
                    required
                    disabled={disabledInputEmail}
                    ref={emailRef}
                    onChange={e => {
                      setEditMode2(true)
                      setEmail(e.target.value.toLocaleLowerCase())
                    }}
                  />
                  {getUserRoles() == 'Technical Administrator' ? (
                    <></>
                  ) : (
                    <i
                      className="fa-solid fa-pen-to-square edit"
                      style={{
                        color: disabledInputEmail ? 'var(--bgColor2)' : 'grey',
                      }}
                      onClick={() => {
                        setDisabledInputEmail(!disabledInputEmail)
                        emailRef.current.focus()
                      }}
                    />
                  )}
                </div>
                <div className="edit_input">
                  <img
                    style={{ width: '20px', height: '20px' }}
                    src={require('../../assets/Icon awesome-address-book.png')}
                  />
                  {disabledInputAddress ? (
                    <input
                      required
                      type="text"
                      disabled={disabledInputAddress}
                      //ref={addressRef}
                      onChange={e => {
                        setAddress(e.target.value)
                      }}
                      value={address}
                    />
                  ) : (
                    <CustomDropdown
                      selectedAddr={address}
                      categories={category}
                      getCompanyList={getCompanyList}
                      getSelectedCompany={getSelectedCompany}
                      setTopicName={setTopicName}
                      // newSelected={address}
                      isProfileEdit={true}
                      setComp={setComp}
                      key={'registration'}
                    />
                  )}
                  {/* <input
                      required
                      type="text"
                      disabled={disabledInputAddress}
                      ref={addressRef}
                      onChange={e => {
                        setAddress(e.target.value)
                      }}
                      style={{display: disabledInputAddress ? 'block' : 'none'}}
                    />
                    <CustomDropdown
                      customDisplay={disabledInputAddress ? 'hidden' : 'block'}
                      categories={category}
                      getCompanyList={getCompanyList}
                      getSelectedCompany={getSelectedCompany}
                      setTopicName={setTopicName}
                      // newSelected={address}
                      key={'registration'}
                    /> */}
                  {getUserRoles() == 'Technical Administrator' ? (
                    <></>
                  ) : (
                    <i
                      className="fa-solid fa-pen-to-square edit"
                      style={{
                        color: disabledInputAddress ? 'var(--bgColor2)' : 'grey',
                      }}
                      onClick={() => {
                        setDisabledInputAddress(!disabledInputAddress)
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="profile-setting__basic-profile profile-setting__box mt-3">
              <h1 className="profile-setting__heading py-3">SALES NEWS BY ROTA YOKOGAWA</h1>
              <div className="sales-news_background">
                {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <div className="profile-setting__sales-news ">
                    {profileData.news_letter?.map((info, index) => (
                      <CustomCheckbox
                        info={info}
                        setCheckedIds={setCheckedIds}
                        index={index}
                        key={index}
                        checkedIds={checkedIds}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="save-btns mt-3">
              {getUserRoles() == 'Technical Administrator' ? (
                <></>
              ) : (
                <button
                  className="delete-btn me-3"
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={async () => {
                    // delete user APi Call and the logout
                    setOpenSimpleDeleteModal(true)
                  }}
                >
                  Delete Account
                </button>
              )}

              <button
                className="btn"
                style={{ color: 'white' }}
                onClick={async () => {
                  const tempNLArray = []
                  profileData.news_letter.map((nl, index) => {
                    let diff = true
                    checkedIds.map((ci, ind) => {
                      if (ci.id == nl.id) {
                        diff = false
                      }
                    })
                    if (diff) {
                      const obj = {
                        id: nl.id,
                        subscribed: false,
                      }
                      tempNLArray.push(obj)
                    } else {
                      const obj = {
                        id: nl.id,
                        subscribed: true,
                      }
                      tempNLArray.push(obj)
                    }
                  })
                  let payload = {
                    news_letter: tempNLArray,
                  }
                  if (
                    name &&
                    validator.isAlpha(name.split(' ')[0]) &&
                    validator.isAlpha(name.split(' ')[1]) &&
                    name.length >= 5
                  ) {
                    if (name && name != '') {
                      payload = {
                        full_name: name,
                        ...payload,
                      }
                    }
                  } else {
                    if (editMode1) {
                      toast.error(
                        'Name should be atleast 5 letters and must contain only letters A-Z or a-z'
                      )
                      return
                    }
                  }
                  if (email && validator.isEmail(email)) {
                    if (email && email != '') {
                      payload = { email, ...payload }
                    }
                  } else {
                    if (editMode2) {
                      toast.error('Please enter email in proper format - abc@xyz.com')
                      return
                    }
                  }
                  if (comp && comp != '') {
                    payload = {
                      company: comp,
                      ...payload,
                    }
                  } else {
                    if (address === '') {
                      toast.error('Please enter valid company')
                      return
                    }
                  }
                  const afterUpdateMsg = await API.post('/auth/profile_settings/', payload)
                  toast.success(afterUpdateMsg.data.message)
                  setReloadData(!reloadData)
                  setName()
                  setEmail()
                  setAddress()
                  setDisabledInputAddress(true)
                  setDisabledInputEmail(true)
                  setDisabledInputName(true)
                  setDisabledInputPassword(true)
                  setDisabledInputPasswordRetype(true)
                  setEditMode1(false)
                  setEditMode2(false)
                }}
              >
                Save Changes
              </button>
            </div>

            <div className="profile-setting__basic-profile profile-setting__box mt-5">
              <h1 className="profile-setting__heading py-3">CHANGE PASSWORD</h1>
              <div className="profile-setting__basic-profile-edit">
                <div className="edit_input">
                  <img
                    style={{ width: '20px', height: '20px' }}
                    src={require('../../assets/Icon awesome-unlock.png')}
                  />

                  <input
                    required
                    type={passwordVisible ? 'text' : 'password'}
                    onChange={e => {
                      setPassword(e.target.value)
                    }}
                    placeholder="Enter New Password"
                  />
                  {passwordVisible ? (
                    <i
                      className="fa-regular fa-eye"
                      onClick={() => {
                        setPasswordVisible(false)
                      }}
                    />
                  ) : (
                    <i
                      className="fa-regular fa-eye-slash"
                      onClick={() => {
                        setPasswordVisible(true)
                      }}
                    />
                  )}
                </div>
                <div className="edit_input">
                  <img
                    style={{ width: '20px', height: '20px' }}
                    src={require('../../assets/Icon awesome-unlock.png')}
                  />
                  <input
                    required
                    type={passwordVisible2 ? 'text' : 'password'}
                    onChange={e => {
                      setPasswordRetype(e.target.value)
                    }}
                    placeholder="Retype New Password"
                  />

                  {passwordVisible2 ? (
                    <i
                      className="fa-regular fa-eye"
                      onClick={() => {
                        setPasswordVisible2(false)
                      }}
                    />
                  ) : (
                    <i
                      className="fa-regular fa-eye-slash"
                      onClick={() => {
                        setPasswordVisible2(true)
                      }}
                    />
                  )}
                </div>
                <span
                  className="alert-under-input"
                  ref={alertRef}
                  style={{ display: 'none', width: '80%', margin: '1rem 1.5rem' }}
                >
                  {actionLabel}
                </span>
              </div>
            </div>

            <div className="save-btns mt-3">
              <button
                className="btn"
                style={{ color: 'white' }}
                onClick={async () => {
                  if (password.length < 8) {
                    setActionLabel(
                      'Password must contain 8-16 characters, one special and numeric value'
                    )
                    setTimeout(() => {
                      alertRef.current.style.display = 'none'
                    }, 3000)
                    alertRef.current.style.display = 'block'
                  } else {
                    if (password != passwordRetype) {
                      toast.error('"Password" and "Confirm Password" must be the same')
                    } else {
                      const payloadPassword = {
                        new_password1: password,
                        new_password2: passwordRetype,
                      }

                      const afterPassChangeMsg = await API.post(
                        '/auth/password-change/',
                        payloadPassword
                      )
                      toast.success(afterPassChangeMsg.data.message)
                      setPassword()
                      setPasswordRetype()
                      setEditMode1(false)
                      setEditMode2(false)
                      setDisabledInputAddress(true)
                      setDisabledInputEmail(true)
                      setDisabledInputName(true)
                      setDisabledInputPassword(true)
                      setDisabledInputPasswordRetype(true)
                      setReloadData(!reloadData)
                    }
                  }
                }}
              >
                Save Password
              </button>
            </div>

            <div className="events_trainings row mt-4">
              <div className="col-12 col-lg-6">
                <div className="profile-setting__basic-profile profile-setting__box h-100">
                  <h1 className="profile-setting__heading py-3 event_training_heading">
                    You are registered for the following events & trainings
                  </h1>
                  {isLoading ? (
                    <span>Loading...</span>
                  ) : (
                    <div className="profile-setting__basic-profile-edit">
                      {profileData.future_trainings?.map((training, index) => (
                        <>
                          <div className="edit_training" key={index}>
                            <i
                              className="fa-solid fa-calendar-check"
                              style={{ color: '#004f9b', fontSize: '20px' }}
                            />
                            <div className="training_text">
                              <span>{training.training_name}</span>
                              <span>{training.training_topic}</span>
                              <span>{training.date}</span>
                              <span>Latest cancellation date {training.cancellation_date}</span>
                            </div>
                            <i
                              onClick={() => {
                                setIsModalOpen(true)
                                fetchEventData(
                                  training.event_id,
                                  training.participant_email,
                                  training.type
                                )
                              }}
                              style={{
                                cursor: 'pointer',
                                color: '#004f9b',
                                fontSize: '20px',
                                marginLeft: 'auto',
                              }}
                              className="fa-solid fa-pen-to-square"
                            />
                          </div>
                          <div className="edit_training" key={index} style={{ margin: 0 }}>
                            <i
                              className="fa-solid fa-location-dot"
                              style={{ color: '#004f9b', fontSize: '20px' }}
                            />
                            <div className="training_text">
                              <span>{training.address}</span>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-lg-6 mt-3 mt-lg-0">
                <div className="profile-setting__basic-profile profile-setting__box h-100">
                  <h1 className="profile-setting__heading py-3 event_training_heading">
                    Last participated event
                  </h1>
                  {isLoading ? (
                    <span>Loading...</span>
                  ) : (
                    <div className="profile-setting__basic-profile-edit">
                      {profileData.participated_trainings
                        ?.slice(0, viewMore ? profileData?.participated_trainings?.length || 50 : 2)
                        .map((training, index) => (
                          <div className="edit_training" key={index}>
                            <i
                              className="fa-solid fa-calendar-check"
                              style={{ color: '#004f9b', fontSize: '20px' }}
                            />
                            <div className="training_text">
                              <span>{training.training_name}</span>
                              <span>{training.date}</span>
                            </div>
                          </div>
                        ))}
                      {profileData?.participated_trainings?.length > 2 && (
                        <p
                          style={{
                            color: 'rgb(0, 79, 155)',
                            paddingRight: '25px',
                            cursor: 'pointer',
                            textAlign: 'right',
                          }}
                          onClick={() => {
                            setViewMore(prev => !prev)
                          }}
                        >
                          {viewMore ? 'view less...' : 'view more...'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BSModal
        show={isModalOpen}
        // style={customStyles}
        centered
        onHide={() => handleModalClose()}
        ariaHideApp={false}
      >
        <BSModal.Header>
          <h3 className="text-center mb-3 w-100">View Preferences</h3>
          <i
            className="fa-solid fa-xmark"
            style={{
              marginBottom: '1rem',
              position: 'absolute',
              // top: '0.6rem',
              right: '1rem',
              padding: '3px 5px',
              borderRadius: '50%',
              background: '#cd0000',
              color: '#fff',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
            onClick={handleModalClose}
          ></i>
        </BSModal.Header>
        <BSModal.Body>
          {isModalLoading ? (
            <h3>Loading...</h3>
          ) : (
            <div style={{ width: '100%' }}>
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
                      disabled={selectedEvent.type === 'internal'}
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedEvent?.hotel_reservation === true}
                      name="hotelYes"
                      onChange={() => {
                        setSelectedEvent(prev => ({
                          ...prev,
                          hotel_reservation: true,
                        }))
                      }}
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
                      disabled={selectedEvent.type === 'internal'}
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedEvent?.hotel_reservation === false}
                      name="hotelNo"
                      onChange={() => {
                        setSelectedEvent(prev => ({
                          ...prev,
                          hotel_reservation: false,
                        }))
                      }}
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
                      disabled={selectedEvent.type === 'internal'}
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedEvent?.shuttle_transport === true}
                      name="shuttleYes"
                      onChange={() => {
                        setSelectedEvent(prev => ({
                          ...prev,
                          shuttle_transport: true,
                        }))
                      }}
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
                      disabled={selectedEvent.type === 'internal'}
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedEvent?.shuttle_transport === false}
                      name="shuttleNo"
                      onChange={() => {
                        setSelectedEvent(prev => ({
                          ...prev,
                          shuttle_transport: false,
                        }))
                      }}
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
                      disabled={selectedEvent.type === 'internal'}
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedEvent?.food_requirements === 'No Requirement'}
                      name="No Requirement"
                      onChange={() => {
                        setSelectedEvent(prev => ({
                          ...prev,
                          food_requirements: 'No Requirement',
                          isOtherSelected: false,
                        }))
                      }}
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
                      disabled={selectedEvent.type === 'internal'}
                      type="checkbox"
                      className="col-lg-4 form-check-input"
                      checked={selectedEvent?.food_requirements === 'No Pork'}
                      name="No Pork"
                      onChange={() => {
                        setSelectedEvent(prev => ({
                          ...prev,
                          food_requirements: 'No Pork',
                          isOtherSelected: false,
                        }))
                      }}
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
                      disabled={selectedEvent.type === 'internal'}
                      type="checkbox"
                      className="col-lg-4 form-check-input"
                      checked={selectedEvent?.food_requirements === 'Vegetarian'}
                      name="Vegetarian"
                      onChange={() => {
                        setSelectedEvent(prev => ({
                          ...prev,
                          food_requirements: 'Vegetarian',
                          isOtherSelected: false,
                        }))
                      }}
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
                      disabled={selectedEvent.type === 'internal'}
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedEvent.isOtherSelected}
                      name="Other, please specify"
                      onChange={() => {
                        setSelectedEvent(prev => ({
                          ...prev,
                          food_requirements: '',
                          isOtherSelected: true,
                        }))
                      }}
                    />
                    <label className="form-check-label" htmlFor="no">
                      Other, please specify
                    </label>
                    {selectedEvent.isOtherSelected && (
                      <input
                        type="text"
                        className="form-control "
                        value={selectedEvent.food_requirements}
                        onChange={event => {
                          setSelectedEvent(prev => ({
                            ...prev,
                            food_requirements: event.target.value,
                          }))
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="row justify-content-between mt-3 w-100" style={{ padding: '0 12px' }}>
                <button
                  style={{
                    width: 'fit-content',
                    background: isModalSubmitting ? '#6c757d' : 'rgb(0, 79, 155)',
                    color: 'white',
                    border: isModalSubmitting ? '1px solid #6c757d' : '1px solid black',
                    borderRadius: '3px',
                    fontSize: '13px',
                    cursor: isModalSubmitting ? 'not-allowed' : 'pointer',
                  }}
                  type="submit"
                  onClick={handleEventUpdate}
                  disabled={isModalSubmitting}
                >
                  Save
                </button>
                <button
                  style={{
                    width: 'fit-content',
                    background: isModalSubmitting ? '#6c757d' : 'rgb(0, 79, 155)',
                    color: 'white',
                    border: isModalSubmitting ? '1px solid #6c757d' : '1px solid black',
                    borderRadius: '3px',
                    fontSize: '13px',
                    cursor: isModalSubmitting ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => {
                    setShowCancelModal(true)
                    setIsModalOpen(false)
                  }}
                  disabled={isModalSubmitting}
                >
                  Cancel Event
                </button>
              </div>
            </div>
          )}
        </BSModal.Body>
      </BSModal>
      <Modal
        isOpen={showCancelModal}
        style={cancelModalStyle}
        onRequestClose={() => setShowCancelModal(false)}
        ariaHideApp={false}
      >
        <div className="row p-4">
          <h4 className="text-center mb-4">Are you sure you want to cancel this event?</h4>
          <div className="d-flex justify-content-center">
            <button
              style={{
                width: '50px',
                background: isModalSubmitting ? '#6c757d' : 'rgb(0, 79, 155)',
                color: 'white',
                border: isModalSubmitting ? '1px solid #6c757d' : '1px solid black',
                borderRadius: '3px',
                fontSize: '13px',
                cursor: isModalSubmitting ? 'not-allowed' : 'pointer',
              }}
              onClick={e => cancelEvent(e)}
            >
              Yes
            </button>
            <button
              style={{
                width: '50px',
                background: isModalSubmitting ? '#6c757d' : 'rgb(0, 79, 155)',
                color: 'white',
                border: isModalSubmitting ? '1px solid #6c757d' : '1px solid black',
                borderRadius: '3px',
                fontSize: '13px',
                cursor: isModalSubmitting ? 'not-allowed' : 'pointer',
                marginLeft: '10px',
              }}
              onClick={() => setShowCancelModal(false)}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ProfileSettingScreen
