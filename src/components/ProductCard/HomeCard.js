import React, { useEffect, useRef, useState } from 'react'
import placeholder from '../../assets/placeholder.png'
import upload from '../../assets/upload.png'
import { getUserRoles } from '../../utils/token'
import './productcard.css'

const HomeCard = ({ index, item, onClick }) => {
  return (
    <div
      onClick={event => {
        onClick()
      }}
      key={item.id}
      role={'button'}
      className={`product-card col-6 col-lg-2 mt-3`}
    >
      <div className="card shadow px-3 py-3 h-100">
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col-12 p-3">
                <div className="img-box thumb rounded d-flex border-dark">
                  <img
                    className="img-thumbnail"
                    src={item.image_link ? item.image_link : placeholder}
                  />
                </div>
                <div className="border text-center rounded mt-3 clamp-2v border-dark">
                  {item.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeCard
