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
import { faL } from '@fortawesome/free-solid-svg-icons'

const ProfileSettingScreen = () => {
  const { loading, setLoading } = useLoading()

  const [profileData, setProfileData] = useState({})
  const [name, setName] = useState()
  const nameRef = useRef()
  const [email, setEmail] = useState()
  const emailRef = useRef()
  const [address, setAddress] = useState()
  const [password, setPassword] = useState()
  const [passwordRetype, setPasswordRetype] = useState()
  const [disabledInputName, setDisabledInputName] = useState(true)
  const [disabledInputEmail, setDisabledInputEmail] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [disabledInputAddress, setDisabledInputAddress] = useState(true)
  const [disabledInputPassword, setDisabledInputPassword] = useState(true)
  const [disabledInputPasswordRetype, setDisabledInputPasswordRetype] = useState(true)

  const [editMode1, setEditMode1] = useState(false)
  const [editMode2, setEditMode2] = useState(false)

  const [openSimpleDeleteModal, setOpenSimpleDeleteModal] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordVisible2, setPasswordVisible2] = useState(false)

  const addressRef = useRef()

  const [checkedIds, setCheckedIds] = useState([])
  const [reloadData, setReloadData] = useState(false)

  const [imageFile, SetImageFile] = useState(null)
  const imageFileInputRef = useRef()
  const [profilePicture, setProfilePicture] = useState(placeholder)
  const [actionLabel, setActionLabel] = useState('')
  const alertRef = useRef()
  const navigate = useNavigate()
  useEffect(async () => {
    // call profile data
    setIsLoading(true)
    setLoading(true)
    const backendData = await API.get('/auth/profile_settings/')
    setProfileData(backendData.data)
    _setProfilePicture(
      backendData.data.basic_profile?.avatar ? backendData.data.basic_profile?.avatar : placeholder
    )
    setIsLoading(false)
    setLoading(false)
  }, [reloadData])

  useEffect(() => {
    nameRef.current.value = profileData.basic_profile?.full_name || 'chael'
    emailRef.current.value = profileData.basic_profile?.email || 'tech@yokogawa.com'
    addressRef.current.value = profileData.basic_profile?.company_name
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
    console.log(afterDeleteMsg)
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
      .catch(error => {
        // toast.error('Error while updating Avatar')
      })
  }

  const _setProfilePicture = avatar => {
    setProfilePicture(avatar)
  }

  return (
    <>
      <Header isLogedIn={getToken()} />
      <div className="row mx-2 mx-md-5 h-100">
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
        <div className="col profile-setting-container pb-5">
          <PrimaryHeading title={'Profile settings'} backgroundImage={'yk-back-image-profile'} />
          <div className="profile-setting">
            <div className="profile-setting__info">
              <div>
                <input
                  accept="image/*"
                  type="file"
                  id="avatar"
                  ref={imageFileInputRef}
                  className="inputfile yk-icon-hover"
                  onChange={e => {
                    SetImageFile(e.target.files[0])
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
                  {/* src\assets\Icon ionic-ios-person.png */}
                  <img
                    style={{ width: '20px', height: '20px' }}
                    src={require('../../assets/Icon ionic-ios-person.png')}
                  />
                  <input
                    autoCapitalize="word"
                    required
                    type="text"
                    disabled={disabledInputName}
                    ref={nameRef}
                    style={{
                      textTransform: 'capitalize',
                    }}
                    onChange={e => {
                      setEditMode1(true)
                      setName(e.target.value)
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
                        setDisabledInputName(!disabledInputName)
                      }}
                    ></i>
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
                      }}
                    ></i>
                  )}
                </div>
                <div className="edit_input">
                  <img
                    style={{ width: '20px', height: '20px' }}
                    src={require('../../assets/Icon awesome-address-book.png')}
                  />

                  <input
                    required
                    type="text"
                    disabled={disabledInputAddress}
                    ref={addressRef}
                    onChange={e => {
                      setAddress(e.target.value)
                    }}
                  />
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
                    ></i>
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
                  className="delete-btn mr-3"
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
                  if (address && address != '') {
                    payload = {
                      company: address,
                      ...payload,
                    }
                  } else {
                    if (addressRef.current.value === '') {
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
                    disabled={disabledInputPassword}
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

                  <i
                    className="fa-solid fa-pen-to-square edit"
                    style={{
                      color: disabledInputPassword ? 'var(--bgColor2)' : 'grey',
                    }}
                    onClick={() => {
                      setDisabledInputPassword(!disabledInputPassword)
                    }}
                  />
                </div>
                <div className="edit_input">
                  <img
                    style={{ width: '20px', height: '20px' }}
                    src={require('../../assets/Icon awesome-unlock.png')}
                  />
                  <input
                    required
                    type={passwordVisible2 ? 'text' : 'password'}
                    disabled={disabledInputPasswordRetype}
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

                  <i
                    className="fa-solid fa-pen-to-square edit"
                    style={{
                      color: disabledInputPasswordRetype ? 'var(--bgColor2)' : 'grey',
                    }}
                    onClick={() => {
                      setDisabledInputPasswordRetype(!disabledInputPasswordRetype)
                    }}
                  />
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
                      toast.error('Password and Confirm Password should be same')
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
                  // if (password || passwordRetype) {
                  //   if (password === passwordRetype) {
                  //     const payloadPassword = {
                  //       new_password1: password,
                  //       new_password2: passwordRetype,
                  //     }

                  //     const afterPassChangeMsg = await API.post(
                  //       '/auth/password-change/',
                  //       payloadPassword
                  //     )
                  //     setPassword(undefined)
                  //     toast.success(afterPassChangeMsg.data.message)

                  //     // toast.success(afterPassChangeMsg.data.detail)
                  //   } else {
                  //     toast.error('Password and retype password does not match')
                  //   }
                  // }
                }}
              >
                Save Password
              </button>
            </div>

            <div className="events_trainings">
              <div className="profile-setting__basic-profile profile-setting__box registered_events">
                <h1 className="profile-setting__heading py-3 event_training_heading">
                  You are registered for the following events & trainings
                </h1>
                {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <div className="profile-setting__basic-profile-edit">
                    {profileData.future_trainings?.map((training, index) => (
                      <div className="edit_training" key={index}>
                        <i className="fa-solid fa-calendar-check" />
                        <div className="training_text">
                          <span>{training.training_topic}</span>
                          <span>{training.date}</span>
                          <span>Latest cancellation date {training.cancellation_date}</span>
                          <span>{training.address}</span>
                        </div>

                        <i className="fa-solid fa-pen-to-square edit" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="profile-setting__basic-profile profile-setting__box last_events">
                <h1 className="profile-setting__heading py-3 event_training_heading">
                  Last participated event
                </h1>
                {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <div className="profile-setting__basic-profile-edit">
                    {profileData.participated_trainings?.map((training, index) => (
                      <div className="edit_training" key={index}>
                        <i className="fa-solid fa-calendar-check" />
                        <div className="training_text">
                          <span>{training.training_name}</span>
                          <span>{training.date}</span>
                        </div>

                        <i className="fa-solid fa-pen-to-square edit" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileSettingScreen
