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

export default () => {
  const [contact, setContact] = useState({})
  const [isEdit, setEdit] = useState(false)
  const [preview, setPreview] = useState()
  const imageInputRef = useRef(null)
  const openingHrsRef = useRef(null)
  const holidaysRef = useRef(null)
  const nameRef = useRef(null)
  const addressRef = useRef(null)
  const phoneRef = useRef(null)
  const videoRef = useRef(null)

  const _getContact = () => {
    API.get('contact').then(data => {
      setContact(data.data)
    })
  }

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
                              ? preview
                              : contact?.general_info?.image_link
                              ? contact?.general_info?.image_link
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
                            ? contact?.general_info?.image_link
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
                            src={item?.image_link ? item.image_link : placeholder}
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

            <div className="profile-brief card-md shadow-sm-md mt-5 p-2 p-lg-5">
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
            </div>

            {/* <!--------------PMK product sales-------------------> */}

            {contact?.contact_people?.map((item, index) => {
              return (
                <div className="pmk-product p-2 p-lg-5 mt-5">
                  <div className="row mb-3">
                    <div className="col-lg-12 col-lg-12 col-xl-12">
                      <p className="h">{item.category}</p>
                      {item?.detail[0]?.email && (
                        <div className="d-flex mb-2 align-items-center">
                          <i className="fa fa-envelope mb-3 theme" aria-hidden="true" />
                          <p className="ps-2">{item?.detail[0]?.email}</p>
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
                              src={card?.image_link ? card?.image_link : placeholder}
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
                            {/* {card?.email && (
                                <div className="d-flex mb-2 align-items-center">
                                  <i className="fa fa-envelope mb-3" aria-hidden="true" />
                                  <p className="ps-2">{card?.email}</p>
                                </div>
                              )} */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
