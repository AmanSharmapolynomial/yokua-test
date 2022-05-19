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
      className={`product-card col-12 col-md-4 mt-3`}
    >
      <div className="card shadow px-3 py-3 h-100">
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col-12 p-3">
                <div className="img-box thumb rounded d-flex">
                  <img
                    className="img-thumbnail"
                    src={item.image_link ? item.image_link : placeholder}
                  />
                </div>
                <div
                  className="border text-center rounded mt-2"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    wordBreak: 'break-word',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                  }}
                >
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
