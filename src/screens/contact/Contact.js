import API from '../../utils/api'
import React, { useEffect, useRef, useState } from 'react'
import './contact.css'
import Header from '../../components/Header'
import { getToken, getUserRoles } from '../../utils/token'
import PrimaryHeading from '../../components/Primary Headings'
import placeholder from '../../assets/placeholder.png'
import upload from '../../assets/upload.png'
import { toast } from 'react-toastify'

export default () => {
  const [contact, setContact] = useState({})
  const [isEdit, setEdit] = useState(false)
  const [preview, setPreview] = useState()
  const imageInputRef = useRef(null)
  const openingHrsRef = useRef(null)
  const holidaysRef = useRef(null)
  const addressRef = useRef(null)
  const phoneRef = useRef(null)

  const _getContact = () => {
    API.get('contact').then(data => {
      setContact(data.data)
    })
  }

  const updateGeneralInformation = () => {
    const payload = {
      id: 1,
      address: addressRef.current.value,
      phone_no: phoneRef.current.value,
      opennig_hours: openingHrsRef.current.value,
      bank_holiday: holidaysRef.current.value,
    }
    const formData = new FormData()
    formData.append('data', JSON.stringify(payload))
    imageInputRef.current.files[0] && formData.append('file', imageInputRef.current.files[0])
    API.post('contact/edit_information', formData)
      .then(res => {
        toast.success(res.message)
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

      if (addressRef.current !== null) addressRef.current.value = contact?.general_info?.address

      if (phoneRef.current !== null) phoneRef.current.value = contact?.general_info?.phone_no

      if (addressRef.current !== null) addressRef.current.value = contact?.general_info?.address

      if (phoneRef.current !== null) phoneRef.current.value = contact?.general_info?.phone_no
    }
  }, [isEdit])

  return (
    <>
      <Header isLogedIn={getToken()} />
      <div className="row mx-2 mx-md-5 h-100">
        <div className="col center py-md-3">
          <PrimaryHeading title={'Contact'} backgroundImage={'yk-back-image-profile'} />
          <div className="yk-admin-contact mt-5">
            <div className="container-fluid`">
              <div className="row mb-3">
                <div className="col">
                  <div className="img-box border border-dark h-100 rounded">
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
                          className="img-thumbnail border-black"
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
                        className="img-thumbnail border-black"
                        src={
                          contact?.general_info?.image_link
                            ? contact?.general_info?.image_link
                            : placeholder
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="col">
                  <div className="cont-detail mt-2">
                    <i className="fa fa-home mb-4 d-flex" aria-hidden="true">
                      {!isEdit ? (
                        <p className="sm-h1 ps-3">{contact?.general_info?.address}</p>
                      ) : (
                        <input ref={addressRef} className="sm-txt" />
                      )}
                    </i>
                    <i className="fa fa-address-book mb-4 d-flex" aria-hidden="true">
                      {!isEdit ? (
                        <p className="sm-h1 ps-3">{contact?.general_info?.address}</p>
                      ) : (
                        <input ref={addressRef} className="sm-txt" />
                      )}
                    </i>
                    <i className="fa fa-phone mb-4 d-flex" aria-hidden="true">
                      {!isEdit ? (
                        <p className="sm-h1 ps-3">{contact?.general_info?.phone_no}</p>
                      ) : (
                        <input ref={phoneRef} className="sm-txt" />
                      )}
                    </i>
                    <i className="fa fa-video-camera mb-4 d-flex" aria-hidden="true">
                      {!isEdit ? (
                        <p className="sm-h1 ps-3">Video conferencing</p>
                      ) : (
                        <input ref={phoneRef} className="sm-txt" />
                      )}
                    </i>
                  </div>
                </div>
                <div className="col-6">
                  <div className="row">
                    {(getUserRoles() == 'PMK Administrator' ||
                      getUserRoles() == 'PMK Content Manager' ||
                      getUserRoles() == 'Technical Administrator') &&
                    isEdit ? (
                      <i
                        role={'button'}
                        className="fa-solid fa-floppy-disk theme ms-auto col-auto p-0"
                        onClick={() => {
                          setEdit(false)
                          updateGeneralInformation()
                        }}
                      />
                    ) : (
                      <i
                        role={'button'}
                        className="fa-solid fa-pen-to-square theme ms-auto col-auto p-0"
                        aria-hidden="true"
                        onClick={() => {
                          setEdit(true)
                        }}
                      />
                    )}
                  </div>
                  <div className="row mt-5">
                    <div className="col card shadow rounded p-4 me-4">
                      <p className="sm-h">Opening Hours</p>
                      {!isEdit ? (
                        <p className="sm-txt">{contact?.general_info?.opening_hours}</p>
                      ) : (
                        <input ref={openingHrsRef} className="sm-txt" />
                      )}
                    </div>

                    <div className="col card shadow rounded p-4">
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

              {/* <!--------------General Product Question start---------------> */}

              <div className="gen-product mt-5 p-5">
                <div className="row">
                  <div className="col-md-12 col-lg-12 col-xl-12">
                    <p className="h">General Product Question</p>
                  </div>
                </div>

                {contact?.product_questions?.map((item, index) => {
                  return (
                    <div className="row mb-4 mt-5">
                      <div className="col-md-4 col-lg-4 col-xl-4">
                        <div className="gen-product-item d-flex ms-2 mb-4">
                          <div className="sm-img-box border border-dark rounded">
                            <img src={item.image_link} />
                          </div>
                          <div>
                            <div className="Product-item-deatail ms-3 ">
                              <div className="product-item-name">
                                <div className="sm-h-box border border-dark rounded px-2 py-2">
                                  <p className="sm-h m-0">{item.name}</p>
                                </div>
                                <i className="fa fa-envelope d-flex mt-4" aria-hidden="true">
                                  <p className="sm-txt ms-2">{item.email}</p>
                                </i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* <!--------------Profile-brief-------------------> */}

              <div className="profile-brief my-5">
                <div className="row py-5">
                  <div className="col-md-2 col-lg-2 col-xl-2">
                    <div className="profile-circle border border-dark">
                      <i className="fa fa-user" aria-hidden="true"></i>
                    </div>
                  </div>

                  <div className="col-md-10 col-lg-10 col-xl-10">
                    <div className="profile-con d-block">
                      <i className="fa fa-user d-flex" aria-hidden="true">
                        <p>Emmunnal de montalinesvhbhm hvhbhb</p>
                      </i>
                      <i className="fa fa-envelope d-flex" aria-hidden="true">
                        <p>Abcd.yokogawa.com</p>
                      </i>
                      <i className="fa fa-phone d-flex" aria-hidden="true">
                        <p>+01 0099283847</p>
                      </i>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!--------------PMK product sales-------------------> */}

              {contact?.contact_people?.map((item, index) => {
                return (
                  <div className="pmk-product p-5">
                    <div className="row mb-3">
                      <div className="col-md-12 col-lg-12 col-xl-12">
                        <p className="h">{item.category}</p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 col-lg-6 col-xl-6">
                        <div className="d-flex ">
                          <div className="sm-img-box-two border border-dark rounded me-4">
                            <img src={item.detail?.image_link} />
                          </div>

                          <div className="pmk-product-detail">
                            {item.detail?.first_name && (
                              <div className="mb-2">
                                <i className="fa fa-user" aria-hidden="true"></i>{' '}
                                {item.detail?.first_name + ' '} {item.detail?.last_name}
                              </div>
                            )}
                            {item.detail?.phone_no && (
                              <div className="d-flex mb-2  align-items-center">
                                <i className="fa fa-phone" aria-hidden="true"></i>
                                <p
                                  className="ms-2 ps-2 mb-0 border border-dark"
                                  style={{ width: '180px' }}
                                >
                                  {item.detail?.phone_no}
                                </p>
                              </div>
                            )}
                            {item.detail?.email && (
                              <div className="d-flex mb-2 align-items-center">
                                <i className="fa fa-envelope mb-3" aria-hidden="true" />
                                <p className="ps-2">{item.detail?.email}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
