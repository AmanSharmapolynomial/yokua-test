import React, { useEffect, useRef, useState } from 'react'
import editIcon from '../../assets/Icon awesome-edit.png'
import placeholder from '../../assets/placeholder.png'

const ProductCard = ({ index, item, onClick, subProduct }) => {
  return (
    <div
      onClick={() => {
        onClick()
      }}
      key={item.id}
      role="button"
      className={`col-12 col-md card shadow ${
        index % 2 === 0 ? 'mr-md-5' : 'ms-md-5'
      } px-2 py-3 mt-3 mt-md-0`}
    >
      <div className="row">
        <div className="col">
          <div className="row">
            <div className="col-6">
              <div className="img-box thumb rounded d-flex">
                <img className="img" src={item.image_link ? item.image_link : placeholder} />
              </div>
              <div className="border text-center rounded mt-2">
                {subProduct ? item.sub_product_name : item.name}
              </div>
            </div>
            <div className="col-6 d-flex align-items-center">{item.description}</div>
          </div>
        </div>
        <span className="col-auto d-none d-md-block">
          <img src={editIcon} />
        </span>
      </div>
    </div>
  )
}

export default ProductCard
