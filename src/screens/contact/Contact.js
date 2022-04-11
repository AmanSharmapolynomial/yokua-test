import API from '../../utils/api'
import React, { useEffect, useState } from 'react'
import './contact.css'
import Header from '../../components/Header'
import { getToken } from '../../utils/token'
import PrimaryHeading from '../../components/Primary Headings'

export default () => {
  const [contact, setContact] = useState({})
  useEffect(() => {
    _getContact()
  }, [])

  const _getContact = () => {
    API.get('contact').then(data => {
      console.log(data.data)
      setContact(data.data)
    })
  }
  return (
    <>
      <Header isLogedIn={getToken()} />
      <div className="row mx-2 mx-md-5 h-100">
        <div className="col profile-setting-container pb-5">
          <PrimaryHeading title={'Contact'} backgroundImage={'yk-back-image-profile'} />
          <div className="yk-admin-contact mt-5">
            <div className="container-fluid`">
              <div className="row">
                <div className="col-md-3 col-lg-3 col-xl-3">
                  <div className="img-box border border-dark h-100 rounded">
                    <i className="fa fa-picture-o" aria-hidden="true" />
                  </div>
                </div>

                <div className="col-md-3 col-lg-3 col-xl-3">
                  <div className="cont-detail mt-2">
                    <i className="fa fa-home mb-4" aria-hidden="true">
                      {'  '}
                      &nbsp; &nbsp;<span className="sm-h">{contact?.general_info?.address}</span>
                    </i>
                    <i className="fa fa-address-book mb-4" aria-hidden="true">
                      &nbsp; &nbsp;<span className="sm-h">{contact?.general_info?.address}</span>
                    </i>
                    <i className="fa fa-phone mb-4" aria-hidden="true">
                      &nbsp; &nbsp; <span className="sm-h">{contact?.general_info?.phone_no}</span>
                    </i>
                    <i className="fa fa-video-camera mb-4" aria-hidden="true">
                      &nbsp; &nbsp;<span className="sm-h">Video conferencing</span>
                    </i>
                  </div>
                </div>

                <div className="col-md-6 col-lg-6 col-xl-6">
                  <div className="boxes d-flex justify-content-around">
                    <div className="box-one border border-dark rounded p-4">
                      <p className="sm-h">Opening Hours</p>
                      <p className="sm-txt">{contact?.general_info?.opening_hours}</p>
                    </div>
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    <div className="box-one border border-dark rounded p-4">
                      <p className="sm-h">Bank Holidays</p>
                      <p className="sm-txt">{contact?.general_info?.bank_holidays}</p>
                    </div>
                  </div>
                </div>
              </div>

              <br />
              <br />

              {/* <!--------------General Product Question start---------------> */}

              <div className="gen-product p-5">
                <div className="row">
                  <div className="col-md-12 col-lg-12 col-xl-12">
                    <p className="h">General Product Question</p>
                  </div>
                </div>

                {contact?.product_questions?.map((item, index) => {
                  return (
                    <div className="row mb-4">
                      <div className="col-md-4 col-lg-4 col-xl-4">
                        <div className="gen-product-item d-flex ml-2 mb-4">
                          <div className="sm-img-box border border-dark rounded">
                            <img src={item.image_link} />
                          </div>
                          <div>
                            <div className="Product-item-deatail">
                              <div className="product-item-name">
                                <div className="sm-h-box border border-dark rounded px-2 py-2">
                                  <p className="sm-h m-0">{item.name}</p>
                                </div>
                                <i className="fa fa-envelope d-flex mt-4" aria-hidden="true">
                                  <span className="sm-txt ml-2">{item.email}</span>
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
                    <div className="profile-con">
                      <i className="fa fa-user d-block" aria-hidden="true">
                        &nbsp; &nbsp;<span>Emmunnal de montalinesvhbhm hvhbhb</span>
                      </i>
                      <i className="fa fa-envelope d-block" aria-hidden="true">
                        &nbsp;
                        <span>Abcd.yokogawa.com</span>
                      </i>
                      <i className="fa fa-phone d-block" aria-hidden="true">
                        &nbsp; &nbsp;<span>+01 0099283847</span>
                      </i>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!--------------PMK product sales-------------------> */}

              {contact?.contact_people?.map((item, index) => {
                return (
                  <div className="pmk-product p-5">
                    <div className="row">
                      <div className="col-md-12 col-lg-12 col-xl-12">
                        <p className="h">{item.category}</p>
                      </div>
                    </div>
                    <br />
                    <br />

                    <div className="row">
                      <div className="col-md-6 col-lg-6 col-xl-6">
                        <div className="d-flex">
                          <div className="sm-img-box border border-dark rounded">
                            <img src={item.detail?.image_link} />
                          </div>
                          &nbsp; &nbsp; &nbsp;
                          <div className="pmk-product-detail">
                            {item.detail?.first_name ||
                              (item.detail?.last_name && (
                                <div>
                                  <i className="fa fa-user" aria-hidden="true"></i>{' '}
                                  {item.detail?.first_name + ' '} {item.detail?.last_name}
                                </div>
                              ))}
                            {item.detail?.phone_no && (
                              <div>
                                <i className="fa fa-phone" aria-hidden="true"></i> &nbsp;
                                <span className="px-2 py-1 border border-dark ">
                                  {item.detail?.phone_no}
                                </span>
                              </div>
                            )}
                            {item.detail?.email && (
                              <div>
                                <i className="fa fa-envelope" aria-hidden="true" />
                                <span className="py-1">{item.detail?.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <br />
                  </div>
                )
              })}

              <br />
              <br />
              <br />

              {/* --------------PMK product handling------------------- */}

              <div className="pmk-product p-5">
                <div className="row mb-4">
                  <div className="col-md-12 col-lg-12 col-xl-12">
                    <p className="h">PMK Product Sales Support</p>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6 col-lg-6 col-xl-6">
                    <div className="d-flex">
                      <div className="sm-img-box border border-dark rounded">
                        <i className="fa fa-user" aria-hidden="true" />
                      </div>
                      &nbsp; &nbsp; &nbsp;
                      <div className="pmk-product-detail">
                        <div>
                          <i className="fa fa-user" aria-hidden="true" /> &nbsp;Jean Michal Reboud
                        </div>
                        <div>
                          <i className="fa fa-envelope" aria-hidden="true" /> &nbsp;
                          <span className="py-1">abcd.yokogawa.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-6 mt-3">
                    <div className="d-flex">
                      <div className="sm-img-box border border-dark rounded">
                        <i className="fa fa-user" aria-hidden="true" />
                      </div>
                      &nbsp; &nbsp; &nbsp;
                      <div className="pmk-product-detail">
                        <div>
                          <i className="fa fa-user" aria-hidden="true" /> &nbsp;Jean Michal Reboud
                        </div>
                        <div>
                          <i className="fa fa-envelope" aria-hidden="true" /> &nbsp;
                          <span className="py-1">abcd.yokogawa.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-lg-6 col-xl-6">
                    <div className="d-flex">
                      <div className="sm-img-box border border-dark rounded">
                        <i className="fa fa-user" aria-hidden="true" />
                      </div>
                      &nbsp; &nbsp; &nbsp;
                      <div className="pmk-product-detail">
                        <div>
                          <i className="fa fa-user" aria-hidden="true" /> &nbsp;Jean Michal Reboud
                        </div>
                        <div>
                          <i className="fa fa-envelope" aria-hidden="true" /> &nbsp;
                          <span className="py-1">abcd.yokogawa.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-6 mt-3">
                    <div className="d-flex">
                      <div className="sm-img-box border border-dark rounded">
                        <i className="fa fa-user" aria-hidden="true" />
                      </div>
                      &nbsp; &nbsp; &nbsp;
                      <div className="pmk-product-detail">
                        <div>
                          <i className="fa fa-user" aria-hidden="true" /> &nbsp;Jean Michal Reboud
                        </div>
                        <div>
                          <i className="fa fa-envelope" aria-hidden="true" /> &nbsp;
                          <span className="py-1">abcd.yokogawa.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
