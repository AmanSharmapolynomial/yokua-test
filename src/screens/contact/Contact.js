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
              <div className="row mb-3">
                <div className="col-md-3 col-lg-3 col-xl-3">
                  <div className="img-box border border-dark h-100 rounded">
                    <i className="fa fa-picture-o" aria-hidden="true" />
                  </div>
                </div>

                <div className="col-md-4 col-lg-4 col-xl-4">
                  <div className="cont-detail mt-2">
                    <i className="fa fa-home mb-4 d-flex" aria-hidden="true">
                      {'  '}
                      <p className="sm-h1 pl-3">{contact?.general_info?.address}</p>
                    </i>
                    <i className="fa fa-address-book mb-4 d-flex" aria-hidden="true">
                      <p className="sm-h1 pl-3">{contact?.general_info?.address}</p>
                    </i>
                    <i className="fa fa-phone mb-4 d-flex" aria-hidden="true">
                       <p className="sm-h1 pl-3">{contact?.general_info?.phone_no}</p>
                    </i>
                    <i className="fa fa-video-camera mb-4 d-flex" aria-hidden="true">
                     <p className="sm-h1 pl-3">Video conferencing</p>
                    </i>
                  </div>
                </div>

                <div className="col-md-5 col-lg-5 col-xl-5">
                  <div className="boxes d-flex">
                    <div className="box-one border border-dark rounded p-4 mr-4">
                      <p className="sm-h">Opening Hours</p>
                      <p className="sm-txt">{contact?.general_info?.opening_hours}</p>
                    </div>
                    
                    <div className="box-one border border-dark rounded p-4">
                      <p className="sm-h">Bank Holidays</p>
                      <p className="sm-txt">{contact?.general_info?.bank_holidays}</p>
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
                        <div className="gen-product-item d-flex ml-2 mb-4">
                          <div className="sm-img-box border border-dark rounded">
                            <img src={item.image_link} />
                          </div>
                          <div>
                            <div className="Product-item-deatail ml-3 ">
                              <div className="product-item-name">
                                <div className="sm-h-box border border-dark rounded px-2 py-2">
                                  <p className="sm-h m-0">{item.name}</p>
                                </div>
                                <i className="fa fa-envelope d-flex mt-4" aria-hidden="true">
                                  <p className="sm-txt ml-2">{item.email}</p>
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
                          <div className="sm-img-box-two border border-dark rounded mr-4">
                            <img src={item.detail?.image_link} />
                          </div>
                         
                          <div className="pmk-product-detail">
                            {item.detail?.first_name&& (
                                <div className='mb-2'>
                                  <i className="fa fa-user" aria-hidden="true"></i>{' '}
                                  {item.detail?.first_name + ' '} {item.detail?.last_name}
                                </div>
                              )}
                            {item.detail?.phone_no && (
                              <div className='d-flex mb-2  align-items-center'>
                                <i className="fa fa-phone" aria-hidden="true"></i>
                                <p className="ml-2 pl-2 mb-0 border border-dark" style={{width:"180px"}} >
                                  {item.detail?.phone_no}
                                </p>
                              </div>
                            )}
                            {item.detail?.email && (
                              <div className='d-flex mb-2 align-items-center'>
                                <i className="fa fa-envelope mb-3" aria-hidden="true" />
                                <p className='pl-2'>{item.detail?.email}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                 
                  </div>
                )
              })}

              

              {/* --------------PMK product handling------------------- */}

              {/* <div className="pmk-product p-5">
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
                 
                      <div className="pmk-product-detail">
                        <div>
                          <i className="fa fa-user" aria-hidden="true"/> Jean Michal Reboud
                        </div>
                        <div>
                          <i className="fa fa-envelope" aria-hidden="true" />
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
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
