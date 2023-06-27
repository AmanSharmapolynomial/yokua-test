import API from '../../utils/api'
import React, { useEffect, useRef, useState } from 'react'
import './contact.css'
import Header from '../../components/Header'
import { getToken, getUserRoles } from '../../utils/token'
import PrimaryHeading from '../../components/Primary Headings'
import placeholder from '../../assets/placeholder.png'
import upload from '../../assets/upload.png'
import { toast } from 'react-toastify'
import Tooltip from '@mui/material/Tooltip'
import { Modal, Image } from 'react-bootstrap'

export default () => {
  const [contact, setContact] = useState({})
  const [isEdit, setEdit] = useState(false)
  const [isSectionEditable, setSectionEditable] = useState(false)
  const [preview, setPreview] = useState()
  const imageInputRef = useRef(null)
  const openingHrsRef = useRef(null)
  const holidaysRef = useRef(null)
  const nameRef = useRef(null)
  const addressRef = useRef(null)
  const phoneRef = useRef(null)
  const videoRef = useRef(null)
  const [isAddSectionModalVisible, setIsAddSectionModalVisible] = useState(false)
  const sectionTitleRef = React.useRef(null)
  const sectionEmailRef = React.useRef('')
  const sectionNameFlagRef = React.useRef()
  const sectionPictureFlagRef = React.useRef()
  const sectionPhoneFlagRef = React.useRef()
  const sectionEmailFlagRef = React.useRef()
  const [sections, setSections] = useState([])
  const [isContactUploadModalVisible, setIsContactUploadModalVisible] = useState(false)
  const [contactSection, setContactSection] = useState()
  const [deleteSectionId, setDeleteSectionId] = useState()
  const [deleteSectionModalVisible, setDeleteSectionModalVisible] = useState(false)
  const firstNameRef = React.useRef(null)
  const lastNameRef = React.useRef(null)
  const emailRef = React.useRef(null)
  const contactPhoneRef = React.useRef(null)
  const imageref = React.useRef(null)
  const [contactNameFlag, setContactNameFlag] = useState(false)
  const [contactPhoneFlag, setContactPhoneFlag] = useState(false)
  const [contactEmailFlag, setContactEmailFlag] = useState(false)
  const [contactImageFlag, setContactImageFlag] = useState(false)
  const [sectionEmailChecked, setSectionEmailChecked] = useState(false)
  const [disabledInput, setDisabledInput] = useState(false)
  const [deletionWarning, setDeletionWarning] = useState('')
  const [isEditable, setIsEditable] = useState(-1)
  const [editSelected, setEditSelected] = useState(null)
  const [delContactId, setDelContactId] = useState(-1)
  const [updateContactId, setUpdateContactId] = useState(-1)
  const [deleteContactModalVisible, setDeleteContactModalVisible] = useState(false)
  const [updateContactModalVisible, setUpdateContactModalVisible] = useState(false)
  const [profilePicture, setProfilePicture] = useState(placeholder)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [imageFile, SetImageFile] = useState(placeholder)
  const [editGenProdQues, setEditGenProdQues] = useState(false)

  const _setImage = () => {
    if (imageFile && imageFile != '') {
      if (typeof imageFile == 'string') {
        setProfilePicture(imageFile)
      } else {
        setProfilePicture(window.URL.createObjectURL(imageFile))
      }
    }
  }
  useEffect(() => {
    _setImage()
  }, [imageFile])

  const handleSectionEmailChange = event => {
    setSectionEmailChecked(event.target.checked)
  }

  const _getContact = () => {
    API.get('contact').then(data => {
      setContact(data.data)
    })
  }

  const onDeleteContact = () => {
    API.post('/contact/delete_add_contacts', {
      id: delContactId,
    })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          res.data?.message && toast.success(res.data?.message)
          getSections()
          _getContact()
          setDeleteContactModalVisible(false)
          setDelContactId()
        }
      })
      .catch(error => {
        setDeleteContactModalVisible(false)
        setDelContactId()
        toast.error(error)
      })
  }
  const getSections = () => {
    API.get('/contact/view_section')
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          console.log(res.data)
          setSections(res.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    getSections()
  }, [])

  console.log(sections)

  const updateGeneralInformation = () => {
    const payload = {
      id: 1,
      name: nameRef.current.value,
      address: addressRef.current.value,
      phone_no: phoneRef.current.value,
      video_conferencing: videoRef.current.value,
      opennig_hours: openingHrsRef.current.value,
      bank_holiday: holidaysRef.current.value,
    }
    const formData = new FormData()
    formData.append('data', JSON.stringify(payload))
    imageInputRef.current.files[0] && formData.append('file', imageInputRef.current.files[0])
    API.post('contact/edit_information', formData)
      .then(res => {
        toast.success(res.data.message)
        _getContact()
      })
      .catch(err => {
        toast.error(err)
      })
  }

  const onAddContact = () => {
    const payload = {
      id: '',
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      phone_no: contactPhoneRef.current.value,
      email: emailRef.current.value,
      category: contactSection,
    }
    const formData = new FormData()
    formData.append('data', JSON.stringify(payload))
    imageref.current.files[0] && formData.append('file', imageref.current.files[0])
    API.post('contact/add_contacts', formData)
      .then(res => {
        toast.success(res.data.message)
        setIsContactUploadModalVisible(false)
        _getContact()
        getSections()
      })
      .catch(err => {
        toast.error(err)
      })
  }

  const updateContact = () => {
    const payload = {
      id: updateContactId,
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      phone_no: contactPhoneRef.current.value,
      email: emailRef.current.value,
      category: contactSection,
    }
    const formData = new FormData()
    formData.append('data', JSON.stringify(payload))
    imageref.current.files[0] && formData.append('file', imageref.current.files[0])
    API.post('contact/add_contacts', formData)
      .then(res => {
        toast.success(res.data.message)
        setUpdateContactModalVisible(false)
        setUpdateContactId(-1)
        setContactSection()
        _getContact()
        getSections()
      })
      .catch(err => {
        toast.error(err)
        setUpdateContactModalVisible(false)
        setUpdateContactId(-1)
        setContactSection()
      })
  }

  const onAddSection = () => {
    API.post('/contact/create_section', {
      name: sectionTitleRef.current.value,
      section_email: sectionEmailRef.current.value,
      name_flag: sectionNameFlagRef.current.checked ? true : false,
      phone_flag: sectionPhoneFlagRef.current.checked ? true : false,
      email_flag: sectionEmailFlagRef.current.checked ? true : false,
      image_flag: sectionPictureFlagRef.current.checked ? true : false,
    })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          res.data?.message && toast.success(res.data?.message)
          getSections()
          setIsAddSectionModalVisible(false)
        }
      })
      .catch(error => {
        setIsAddSectionModalVisible(false)
        toast.error(error)
        console.log(error)
      })
  }

  const onDeletSection = () => {
    API.post('/contact/delete_section', {
      section_id: deleteSectionId,
    })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          res.data?.message && toast.success(res.data?.message)
          _getContact()
          getSections()
          setDeleteSectionModalVisible(false)
          setDeleteSectionId()
          setDeletionWarning()
        }
      })
      .catch(error => {
        setDeleteSectionModalVisible(false)
        setDeleteSectionId()
        setDeletionWarning()
        toast.error(error)
      })
  }

  useEffect(() => {
    _getContact()
  }, [])

  useEffect(() => {
    if (isEdit) {
      if (openingHrsRef.current !== null)
        openingHrsRef.current.value = contact?.general_info?.opening_hours

      if (holidaysRef.current !== null)
        holidaysRef.current.value = contact?.general_info?.bank_holidays

      if (nameRef.current !== null) nameRef.current.value = contact?.general_info?.name

      if (addressRef.current !== null) addressRef.current.value = contact?.general_info?.address

      if (phoneRef.current !== null) phoneRef.current.value = contact?.general_info?.phone_no

      if (videoRef.current !== null)
        videoRef.current.value = contact?.general_info?.video_conferencing
    }
  }, [isEdit])

  return (
    <>
      <Header isLogedIn={getToken()} />
      <div className="row mx-2 mx-lg-5 h-100">
        <div className="col center py-3">
          <PrimaryHeading title={'Contact'} backgroundImage={'yk-back-image-profile'} />
          <div className="yk-admin-contact mt-5">
            <div className="card-md shadow-sm-md mb-3 p-4">
              <div className="row">
                <div className="col-3 col-md">
                  <div className="img-box border border-dark rounded">
                    {isEdit ? (
                      <>
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/png, image/gif, image/jpeg"
                          className="d-none"
                          onChange={e => {
                            if (!e.target.files[0]) {
                              setPreview(undefined)
                              return
                            }

                            const objectUrl = URL.createObjectURL(e.target.files[0])
                            setPreview(objectUrl)
                          }}
                        />
                        <img
                          className="border-black"
                          src={
                            preview
                              ? preview + `?token=${getToken()}`
                              : contact?.general_info?.image_link + `?token=${getToken()}`
                              ? contact?.general_info?.image_link + `?token=${getToken()}`
                              : upload
                          }
                          onClick={e => {
                            e.stopPropagation()
                            imageInputRef.current.click()
                          }}
                        />
                      </>
                    ) : (
                      <img
                        className="border-black"
                        src={
                          contact?.general_info?.image_link
                            ? contact?.general_info?.image_link + `?token=${getToken()}`
                            : placeholder
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="col-9 col-md">
                  <div className="cont-detail">
                    <i className="fa fa-home mb-lg-4 d-flex align-items-center" aria-hidden="true">
                      {!isEdit ? (
                        <p className="sm-h1 ps-2 ps-lg-3 clamp-1v m-0">
                          {contact?.general_info?.name}
                        </p>
                      ) : (
                        <input ref={nameRef} className="sm-txt ms-2 ms-lg-3" />
                      )}
                    </i>
                    <i
                      className="fa fa-address-book mb-lg-4 d-flex align-items-center"
                      aria-hidden="true"
                    >
                      {!isEdit ? (
                        <p className="sm-h1 ps-2 ps-lg-3 clamp-1v m-0">
                          {contact?.general_info?.address}
                        </p>
                      ) : (
                        <input ref={addressRef} className="sm-txt ms-2 ms-lg-3" />
                      )}
                    </i>
                    <i className="fa fa-phone mb-lg-4 d-flex align-items-center" aria-hidden="true">
                      {!isEdit ? (
                        <p className="sm-h1 ps-2 ps-lg-3 clamp-1v m-0">
                          {contact?.general_info?.phone_no}
                        </p>
                      ) : (
                        <input ref={phoneRef} className="sm-txt ms-2 ms-lg-3" />
                      )}
                    </i>
                    <i
                      className="fa fa-video-camera mb-lg-4 d-flex align-items-center"
                      aria-hidden="true"
                    >
                      {!isEdit ? (
                        <p className="sm-h1 ps-3 text-break clamp-1v m-0">
                          {contact?.general_info?.video_conferencing}
                        </p>
                      ) : (
                        <input ref={videoRef} className="sm-txt ms-2 ms-lg-3" />
                      )}
                    </i>
                  </div>
                </div>
                <div className="col col-lg-6">
                  <div className="row d-none d-lg-flex">
                    {(getUserRoles() == 'PMK Administrator' ||
                      getUserRoles() == 'PMK Content Manager' ||
                      getUserRoles() == 'Technical Administrator') &&
                    isEdit ? (
                      <Tooltip title="Save Changes">
                        <i
                          role={'button'}
                          className="fa-solid fa-floppy-disk theme ms-auto col-auto p-0"
                          onClick={() => {
                            setEdit(false)
                            updateGeneralInformation()
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Edit Information">
                        <i
                          role={'button'}
                          className="fa-solid fa-pen-to-square theme ms-auto col-auto p-0"
                          aria-hidden="true"
                          onClick={() => {
                            setEdit(true)
                          }}
                        />
                      </Tooltip>
                    )}
                  </div>
                  <div className="row mt-5">
                    <div className="col card shadow-sm rounded p-4 me-4">
                      <p className="sm-h">Opening Hours</p>
                      {!isEdit ? (
                        <p className="sm-txt">{contact?.general_info?.opening_hours}</p>
                      ) : (
                        <input ref={openingHrsRef} className="sm-txt" />
                      )}
                    </div>

                    <div className="col card shadow-sm rounded p-4">
                      <p className="sm-h">Bank Holidays</p>
                      {!isEdit ? (
                        <p className="sm-txt">{contact?.general_info?.bank_holidays}</p>
                      ) : (
                        <input ref={holidaysRef} className="sm-txt" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!--------------General Product Question start---------------> */}

            <div className="gen-product mt-5 p-2 p-lg-5">
              <div className="row d-none d-lg-flex">
                {(getUserRoles() == 'PMK Administrator' ||
                  getUserRoles() == 'PMK Content Manager' ||
                  getUserRoles() == 'Technical Administrator') &&
                editGenProdQues == true ? (
                  <div className="my-2 p-0 d-none d-lg-block text-right">
                    <Tooltip title="Save Changes">
                      <i
                        role={'button'}
                        className="fa-solid mx-2 fa-floppy-disk theme ms-auto col-auto p-0"
                        aria-hidden="true"
                        onClick={() => {
                          setEditGenProdQues(false)
                          toast.success('Section Updated')
                          SetImageFile(placeholder)
                        }}
                      />
                    </Tooltip>
                  </div>
                ) : (
                  <Tooltip title="Edit Section">
                    <i
                      role={'button'}
                      className="fa-solid fa-pen-to-square theme ms-auto col-auto p-0"
                      aria-hidden="true"
                      onClick={() => {
                        setEditGenProdQues(true)
                        SetImageFile(placeholder)
                      }}
                    />
                  </Tooltip>
                )}
              </div>
              <div className="row">
                <div className="col-lg-12 col-lg-12 col-xl-12">
                  <p className="h">General Product Question</p>
                </div>
              </div>
              <div className="row mb-4 mt-5">
                {contact?.product_questions?.map((item, index) => {
                  return (
                    <div className="col-lg-4">
                      <div className="gen-product-item d-flex ms-2 mb-4">
                        <div className="sm-img-box border border-dark rounded col-3 p-0">
                          <img
                            src={
                              item?.image_link
                                ? item.image_link + `?token=${getToken()}`
                                : placeholder
                            }
                            style={{
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%',
                            }}
                          />
                        </div>
                        <div className="Product-item-deatail ms-lg-3 col-9">
                          <div className="product-item-name">
                            <div className="sm-h-box border border-dark rounded px-2 py-2">
                              <p className="sm-h m-0">{item.name}</p>
                            </div>
                            <div className="mt-2 row">
                              <i
                                className="fa fa-envelope col-auto align-self-center h-auto"
                                aria-hidden="true"
                              />
                              <span className="sm-txt text-break col ps-0">{item.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* <!--------------Profile-brief-------------------> */}

            {/* <div className="profile-brief card-md shadow-sm-md mt-5 p-2 p-lg-5">
              <div className="row mb-3 d-none d-lg-block">
                <div className="col-lg-12 col-lg-12 col-xl-12">
                  <p className="h">Sales and Marketing Manager</p>
                </div>
              </div>
              <div className="row">
                <div className="col-auto d-flex align-items-center">
                  <div className="profile-circle border border-dark">
                    <i className="fa fa-user" aria-hidden="true"></i>
                  </div>
                </div>

                <div className="col d-flex align-items-center">
                  <div className="profile-con">
                    <div className="row">
                      <i className="fa fa-user col-auto align-self-center" aria-hidden="true"></i>
                      <span className="col text-break">
                        Emmanuel de Montillet - Sales and Marketing Manager
                      </span>
                    </div>
                    <div className="row">
                      <i
                        className="fa fa-envelope col-auto align-self-center"
                        aria-hidden="true"
                      ></i>
                      <span className="col text-break">emmanuel.de.montillet@de.yokogawa.com</span>
                    </div>
                    <div className="row">
                      <i className="fa fa-phone col-auto align-self-center" aria-hidden="true"></i>
                      <span className="col text-break">+49 7761 567 - 130</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* <!--------------PMK product sales-------------------> */}
            {contact?.contact_people?.map((item, index) => {
              return (
                <div className="pmk-product p-2 p-lg-5 mt-5">
                  <div className="row d-none d-lg-flex">
                    {(getUserRoles() == 'PMK Administrator' ||
                      getUserRoles() == 'PMK Content Manager' ||
                      getUserRoles() == 'Technical Administrator') &&
                    isEditable == item.category_id ? (
                      <div className="my-2 p-0 d-none d-lg-block text-right">
                        <Tooltip title="Save Changes">
                          <i
                            role={'button'}
                            className="fa-solid mx-2 fa-floppy-disk theme ms-auto col-auto p-0"
                            aria-hidden="true"
                            onClick={() => {
                              setIsEditable(-1)
                              toast.success('Section Updated')
                              SetImageFile(placeholder)
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Delete Section">
                          <i
                            role={'button'}
                            className="fa-solid mx-2 fa-trash ms-auto col-auto p-0"
                            aria-hidden="true"
                            onClick={() => {
                              setDeleteSectionId(item?.category_id)
                              setDeletionWarning(
                                'You are attempting to delete a non-empty section. It will delete all the contacts of this section. Do you want to proceed?'
                              )
                              setDeleteSectionModalVisible(true)
                            }}
                          />
                        </Tooltip>
                      </div>
                    ) : (
                      <Tooltip title="Edit Section">
                        <i
                          role={'button'}
                          className="fa-solid fa-pen-to-square theme ms-auto col-auto p-0"
                          aria-hidden="true"
                          onClick={() => {
                            setSectionEditable(true)
                            SetImageFile(placeholder)
                            setContactPhoneFlag(false)
                            setContactEmailFlag(false)
                            if (item.cateory_id !== isEditable) setIsEditable(item.category_id)
                            else setIsEditable(-1)
                            setEditSelected(null)
                          }}
                        />
                      </Tooltip>
                    )}
                  </div>
                  <div className="row mb-3">
                    <div className="col-lg-12 col-lg-12 col-xl-12">
                      <p className="h">{item.category}</p>
                      {item?.category_email && (
                        <div className="d-flex mb-2 align-items-center">
                          <i className="fa fa-envelope mb-3 theme" aria-hidden="true" />
                          <p className="ps-2" style={{ wordBreak: 'break-all' }}>
                            {item?.category_email}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    {item.detail.map((card, idx) => (
                      <div className="col-lg-6 mt-3">
                        <div className="d-flex">
                          <div className="col-3 p-0">
                            <img
                              className="border border-dark rounded"
                              src={
                                card?.image_link
                                  ? card?.image_link + `?token=${getToken()}`
                                  : placeholder
                              }
                              style={{
                                objectFit: 'cover',
                                width: '100%',
                              }}
                            />
                          </div>

                          <div className="pmk-product-detail ms-lg-3 col-9">
                            {card?.first_name && (
                              <div className="mb-2 row">
                                <i
                                  className="fa fa-user col-auto align-self-center"
                                  aria-hidden="true"
                                ></i>
                                <p className="mb-0 col p-0">
                                  {card?.first_name + ' '} {card?.last_name}
                                </p>
                              </div>
                            )}
                            {card?.phone_no && (
                              <div className="d-flex mb-2  align-items-center">
                                <i className="fa fa-phone" aria-hidden="true"></i>
                                <p className="ms-2 px-2 mb-0 border border-dark w-auto">
                                  {card?.phone_no}
                                </p>
                              </div>
                            )}
                            {card?.email && (
                              <div className="d-flex mb-2 align-items-center">
                                <i className="fa fa-envelope mb-3" aria-hidden="true" />
                                <p className="ps-2">{card?.email}</p>
                              </div>
                            )}
                            {isEditable == item.category_id && (
                              <div className="d-flex mb-2 align-items-center">
                                <i
                                  role={'button'}
                                  className="fa fa-pen-to-square theme mb-3 mx-2"
                                  aria-hidden="true"
                                  onClick={() => {
                                    setUpdateContactId(card?.id)
                                    setUpdateContactModalVisible(true)
                                    setContactSection(item.category)
                                    setFirstName(card?.first_name)
                                    setLastName(card?.last_name)
                                    SetImageFile(
                                      card?.image_link
                                        ? card?.image_link + `?token=${getToken()}`
                                        : placeholder
                                    )
                                    if (card?.email) {
                                      setEmail(card?.email)
                                      setContactEmailFlag(true)
                                    }
                                    if (card?.phone_no) {
                                      setPhone(card?.phone_no)
                                      setContactPhoneFlag(true)
                                    }
                                  }}
                                />
                                <i
                                  role={'button'}
                                  className="fa-solid fa-trash mb-3 mx-2"
                                  style={{ color: 'red' }}
                                  aria-hidden="true"
                                  onClick={() => {
                                    setDelContactId(card?.id)
                                    setDeleteContactModalVisible(true)
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Add Contact Button */}
                  {(getUserRoles() == 'PMK Administrator' ||
                    getUserRoles() == 'PMK Content Manager' ||
                    getUserRoles() == 'Technical Administrator') &&
                  isEditable == item.category_id ? (
                    <div class="mt-4 justify-content-center d-none d-lg-flex">
                      <button
                        onClick={() => {
                          setIsContactUploadModalVisible(true)
                          setContactSection(item.category)
                          if (item?.detail[0].email !== '') {
                            setContactEmailFlag(true)
                          } else {
                            setContactEmailFlag(false)
                          }
                          if (item?.detail[0].phone_no !== '') {
                            setContactPhoneFlag(true)
                          } else {
                            setContactPhoneFlag(false)
                          }
                        }}
                        class="btn create-domain-btn mx-auto"
                      >
                        Add Contact
                      </button>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          {sections
            .filter(
              section =>
                !contact?.contact_people?.some(item => item.category === section.section_name)
            )
            .map((element, index) => (
              <div
                className="pmk-product p-2 p-lg-5 mt-5 mb-3"
                style={{ boxShadow: '0px 0px 8px #c4c4c4' }}
                key={index}
              >
                <div className="row d-none d-lg-flex">
                  {(getUserRoles() == 'PMK Administrator' ||
                    getUserRoles() == 'PMK Content Manager' ||
                    getUserRoles() == 'Technical Administrator') &&
                  isEditable == element.section_id ? (
                    <div className="my-2 p-0 d-none d-lg-block text-right">
                      <Tooltip title="Save Changes">
                        <i
                          role={'button'}
                          className="fa-solid mx-2 fa-floppy-disk theme ms-auto col-auto p-0"
                          aria-hidden="true"
                          onClick={() => {
                            setIsEditable(-1)
                            toast.success('Section Updated')
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Delete Section">
                        <i
                          role={'button'}
                          className="fa-solid mx-2 fa-trash ms-auto col-auto p-0"
                          aria-hidden="true"
                          onClick={() => {
                            setDeleteSectionId(element.section_id)
                            setDeleteSectionModalVisible(true)
                          }}
                        />
                      </Tooltip>
                    </div>
                  ) : (
                    <Tooltip title="Edit Section">
                      <i
                        role={'button'}
                        className="fa-solid fa-pen-to-square theme ms-auto col-auto p-0"
                        aria-hidden="true"
                        onClick={() => {
                          SetImageFile(placeholder)
                          setSectionEditable(true)
                          if (element.section_id !== isEditable) setIsEditable(element.section_id)
                          else setIsEditable(-1)
                          setEditSelected(null)
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
                <div className="row mb-3">
                  <div className="col-lg-12 col-lg-12 col-xl-12">
                    <p className="h">{element.section_name}</p>
                    <div className="d-flex mb-2 align-items-center">
                      <i className="fa fa-envelope mb-3 theme" aria-hidden="true" />
                      <p className="ps-2" style={{ wordBreak: 'break-all' }}>
                        {element?.section_email}
                      </p>
                    </div>
                    {(getUserRoles() == 'PMK Administrator' ||
                      getUserRoles() == 'PMK Content Manager' ||
                      getUserRoles() == 'Technical Administrator') &&
                    isEditable == element.section_id ? (
                      <button
                        onClick={() => {
                          setIsContactUploadModalVisible(true)
                          setContactSection(element.section_name)
                          setContactNameFlag(element.section_name_flag)
                          setContactPhoneFlag(element.section_phone_flag)
                          setContactEmailFlag(element.section_email_flag)
                          setContactImageFlag(element.section_image_flag)
                        }}
                        class="btn create-domain-btn mx-4"
                      >
                        Add Contact
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          {/* Add section Button */}
          {(getUserRoles() == 'PMK Administrator' ||
            getUserRoles() == 'PMK Content Manager' ||
            getUserRoles() == 'Technical Administrator') && (
            <div class="mt-2 justify-content-center d-none d-lg-flex">
              <button
                onClick={() => {
                  setIsAddSectionModalVisible(true)
                }}
                class="btn create-domain-btn mx-auto"
              >
                Add New Section
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        show={isAddSectionModalVisible}
        centered
        onHide={() => {
          setIsAddSectionModalVisible(false)
        }}
      >
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
            textAlign: 'center',
          }}
        >
          <Modal.Title>Add New Section</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="mb-2">
            <input
              ref={sectionTitleRef}
              placeholder="Enter new title"
              type="text"
              className="form-control w-100"
              aria-label={'Title'}
            />
          </div>
          <div className="mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              aria-label={'Section Email'}
              id="sectionemailFlag"
              checked={sectionEmailChecked}
              onChange={handleSectionEmailChange}
            />
            <label class="form-check-label" for="sectionemailFlag">
              Section Email
            </label>
          </div>
          {sectionEmailChecked && (
            <div className="mb-2">
              <input
                ref={sectionEmailRef}
                placeholder="Enter section email"
                type="text"
                className="form-control w-100"
                aria-label={'Section Email'}
              />
            </div>
          )}
          <div className="mb-2">
            <input
              ref={sectionPictureFlagRef}
              type="checkbox"
              defaultChecked
              disabled
              className="form-check-input"
              aria-label={'Profile Picture'}
              id="pictureFlag"
            />
            <label class="form-check-label" for="pictureFlag">
              Picture
            </label>
          </div>
          <div className="mb-2">
            <input
              ref={sectionNameFlagRef}
              type="checkbox"
              defaultChecked
              disabled
              className="form-check-input"
              aria-label={'Name'}
              id="nameFlag"
            />
            <label class="form-check-label" for="nameFlag">
              Name
            </label>
          </div>
          <div className="mb-2">
            <input
              ref={sectionEmailFlagRef}
              type="checkbox"
              className="form-check-input"
              aria-label={'Email'}
              id="emailFlag"
            />
            <label class="form-check-label" for="emailFlag">
              Email
            </label>
          </div>
          <div className="mb-2">
            <input
              ref={sectionPhoneFlagRef}
              type="checkbox"
              className="form-check-input"
              aria-label={'Phone'}
              id="phoneFlag"
            />
            <label class="form-check-label" for="phoneFlag">
              Phone
            </label>
          </div>
          <div className="col-12 justify-content-center d-flex mt-3">
            <button
              ref={element => {
                if (element) {
                  element.style.setProperty('background-color', 'transparent', 'important')
                  element.style.setProperty('color', 'var(--bgColor2)', 'important')
                }
              }}
              onClick={() => {
                setIsAddSectionModalVisible(false)
              }}
              className="btn me-2"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary ms-2"
              onClick={() => {
                if (sectionTitleRef.current.value.length > 0) {
                  onAddSection()
                } else {
                  toast.error('Please enter section title')
                }
              }}
            >
              Confirm
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Delete Section Modal */}
      <Modal
        show={deleteSectionModalVisible}
        centered
        onHide={() => {
          setDeleteSectionModalVisible(false)
        }}
      >
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
            textAlign: 'center',
          }}
        >
          <Modal.Title>Confirm Section Deletion</Modal.Title>
        </Modal.Header>
        <p className="text-center" style={{ fontWeight: '12px' }}>
          {deletionWarning}
        </p>
        <Modal.Body className="p-4 text-center">
          <div className="col-12 justify-content-center d-flex mt-3">
            <button
              onClick={() => {
                setDeleteSectionModalVisible(false)
              }}
              className="btn me-2"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary ms-2"
              onClick={() => {
                onDeletSection()
              }}
            >
              Confirm
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Delete Section Modal Ends */}

      {/* Delete Contact Modal */}
      <Modal
        show={deleteContactModalVisible}
        centered
        onHide={() => {
          setDeleteContactModalVisible(false)
        }}
      >
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
            textAlign: 'center',
          }}
        >
          <Modal.Title>Confirm Contact Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="col-12 justify-content-center d-flex mt-3">
            <button
              onClick={() => {
                setDeleteContactModalVisible(false)
              }}
              className="btn me-2"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary ms-2"
              onClick={() => {
                onDeleteContact()
              }}
            >
              Confirm
            </button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Delete Contact Modal Ends */}

      {/* Contact Upload Modal */}
      <Modal
        show={isContactUploadModalVisible}
        centered
        onHide={() => {
          setIsContactUploadModalVisible(false)
        }}
        dialogClassName="max-width-40"
      >
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
            textAlign: 'center',
          }}
        >
          <Modal.Title>Add New Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div
            className="row flex-row modal-content justify-content-center mt-4"
            style={{
              border: '0',
            }}
          >
            <div className="col-auto user-img">
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg"
                id="imageFile"
                ref={imageref}
                className="inputfile yk-icon-hover"
                onChange={e => {
                  console.log(e.target.files[0])
                  SetImageFile(e.target.files[0])
                }}
              />
              <img
                style={{
                  cursor: !disabledInput ? 'pointer' : 'default',
                }}
                onClick={() => {
                  !disabledInput && imageref.current.click()
                }}
                src={profilePicture}
                onError={() => setProfilePicture(placeholder)}
              />
            </div>
            <div className="col user-details-form">
              <div className="input-field-container">
                <label htmlFor="contactSection" className="input-label font-weight-bold">
                  Section
                </label>
                <input
                  id="contactSection"
                  disabled
                  placeholder={contactSection ? contactSection : ''}
                  type="text"
                  className="input-text"
                  aria-label="Section"
                />
              </div>
              <div className="input-field-container">
                <label htmlFor="firstName" className="input-label font-weight-bold">
                  First Name
                </label>
                <input
                  ref={firstNameRef}
                  type="text"
                  className="input-text"
                  aria-label="First Name"
                  id="firstName"
                />
              </div>

              <div className="input-field-container">
                <label htmlFor="lastName" className="input-label font-weight-bold">
                  Last Name
                </label>
                <input
                  ref={lastNameRef}
                  type="text"
                  className="input-text"
                  aria-label="Last Name"
                  id="lastName"
                />
              </div>

              <div className={`input-field-container ${contactEmailFlag ? '' : 'd-none'}`}>
                <label htmlFor="emailID" className="input-label font-weight-bold">
                  Email:
                </label>
                <input
                  ref={emailRef}
                  type="text"
                  className="input-text"
                  aria-label="Email"
                  id="emailID"
                />
              </div>
              <div className={`input-field-container ${contactPhoneFlag ? '' : 'd-none'}`}>
                <label htmlFor="phoneNo" className="input-label font-weight-bold">
                  Phone Number:
                </label>
                <input
                  ref={contactPhoneRef}
                  type="text"
                  className="input-text"
                  aria-label="Phone Number"
                  id="phoneNo"
                />
              </div>
            </div>
          </div>
          <div className="col-12 justify-content-center d-flex mt-3">
            <button
              ref={element => {
                if (element) {
                  element.style.setProperty('background-color', 'transparent', 'important')
                  element.style.setProperty('color', 'var(--bgColor2)', 'important')
                }
              }}
              onClick={() => {
                setIsContactUploadModalVisible(false)
              }}
              className="btn me-2"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary ms-2"
              onClick={() => {
                if (firstNameRef.current.value.length > 0 && lastNameRef.current.value.length > 0) {
                  onAddContact()
                } else {
                  toast.error('Please enter the name')
                }
              }}
            >
              Add
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Update Contact Person */}
      <Modal
        show={updateContactModalVisible}
        centered
        onHide={() => {
          setUpdateContactModalVisible(false)
        }}
        dialogClassName="max-width-40"
      >
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
            textAlign: 'center',
          }}
        >
          <Modal.Title>Update Contact Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div
            className="row flex-row modal-content justify-content-center mt-4"
            style={{
              border: '0',
            }}
          >
            <div className="col-auto user-img">
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg"
                id="imageFile"
                ref={imageref}
                className="inputfile yk-icon-hover"
                onChange={e => {
                  console.log(e.target.files[0])
                  SetImageFile(e.target.files[0])
                }}
              />
              <img
                style={{
                  cursor: !disabledInput ? 'pointer' : 'default',
                }}
                onClick={() => {
                  !disabledInput && imageref.current.click()
                }}
                src={profilePicture}
                onError={() => setProfilePicture(placeholder)}
              />
            </div>
            <div className="col user-details-form">
              <div className="input-field-container">
                <label htmlFor="contactSection" className="input-label font-weight-bold">
                  Section
                </label>
                <input
                  id="contactSection"
                  disabled
                  placeholder={contactSection ? contactSection : ''}
                  type="text"
                  className="input-text"
                  aria-label="Section"
                />
              </div>
              <div className="input-field-container">
                <label htmlFor="firstName" className="input-label font-weight-bold">
                  First Name
                </label>
                <input
                  ref={firstNameRef}
                  type="text"
                  className="input-text"
                  aria-label="First Name"
                  id="firstName"
                  value={firstName}
                  onChange={e => {
                    setFirstName(e.target.value)
                  }}
                />
              </div>

              <div className="input-field-container">
                <label htmlFor="lastName" className="input-label font-weight-bold">
                  Last Name
                </label>
                <input
                  ref={lastNameRef}
                  type="text"
                  className="input-text"
                  aria-label="Last Name"
                  id="lastName"
                  value={lastName}
                  onChange={e => {
                    setLastName(e.target.value)
                  }}
                />
              </div>

              <div className={`input-field-container ${contactEmailFlag ? '' : 'd-none'}`}>
                <label htmlFor="emailID" className="input-label font-weight-bold">
                  Email:
                </label>
                <input
                  ref={emailRef}
                  type="text"
                  className="input-text"
                  aria-label="Email"
                  id="emailID"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value)
                  }}
                />
              </div>
              <div className={`input-field-container ${contactPhoneFlag ? '' : 'd-none'}`}>
                <label htmlFor="phoneNo" className="input-label font-weight-bold">
                  Phone Number:
                </label>
                <input
                  ref={contactPhoneRef}
                  type="text"
                  className="input-text"
                  aria-label="Phone Number"
                  id="phoneNo"
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value)
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-12 justify-content-center d-flex mt-3">
            <button
              ref={element => {
                if (element) {
                  element.style.setProperty('background-color', 'transparent', 'important')
                  element.style.setProperty('color', 'var(--bgColor2)', 'important')
                }
              }}
              onClick={() => {
                setUpdateContactModalVisible(false)
              }}
              className="btn me-2"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary ms-2"
              onClick={() => {
                if (firstNameRef.current.value.length > 0 && lastNameRef.current.value.length > 0) {
                  updateContact()
                } else {
                  toast.error('Please enter the name')
                }
              }}
            >
              Save
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
