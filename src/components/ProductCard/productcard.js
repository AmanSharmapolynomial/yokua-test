import React, { useEffect, useRef, useState } from 'react'
import editIcon from '../../assets/Icon awesome-edit.png'
import placeholder from '../../assets/placeholder.png'
import upload from '../../assets/upload.png'
import './productcard.css'
const ProductCard = ({ index, item, onClick, subProduct, onUpdate }) => {
  const [isEditable, setIsEditable] = useState(false)
  const [preview, setPreview] = useState()
  const imageInputRef = useRef(null)
  const inputRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (isEditable) {
      if (textareaRef.current !== null) textareaRef.current.value = item.description
      if (inputRef.current !== null)
        inputRef.current.value = subProduct ? item.sub_product_name : item.name
    }
  }, [isEditable])

  return (
    <div
      onClick={event => {
        !isEditable && onClick()
      }}
      key={item.id}
      role={!isEditable && 'button'}
      className={`col-12 col-md card shadow ${
        index % 2 === 0 ? 'mr-md-5' : 'ms-md-5'
      } px-2 py-3 mt-3 mt-md-0`}
    >
      <div className="row">
        <div className="col">
          <div className="row">
            <div className="col-6">
              <div className="img-box thumb rounded d-flex">
                {isEditable ? (
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
                      className="img-thumbnail"
                      src={preview ? preview : item?.image_link ? item.image_link : upload}
                      onClick={e => {
                        e.stopPropagation()
                        imageInputRef.current.click()
                      }}
                    />
                  </>
                ) : (
                  <img
                    className="img-thumbnail"
                    src={item.image_link ? item.image_link : placeholder}
                  />
                )}
              </div>
              {isEditable ? (
                <div className="border text-center rounded mt-2">
                  <input ref={inputRef} />
                </div>
              ) : (
                <div className="border text-center rounded mt-2">
                  {subProduct ? item.sub_product_name : item.name}
                </div>
              )}
            </div>

            {isEditable ? (
              <textarea ref={textareaRef} className="col-6 d-flex align-items-center" />
            ) : (
              <div className="col-6 d-flex align-items-center">{item.description}</div>
            )}
          </div>
        </div>
        <span className="col-auto d-none d-md-block">
          <img
            src={editIcon}
            onClick={e => {
              e.stopPropagation()
              if (isEditable) {
                try {
                  if (
                    inputRef.current.value.trim() !== '' &&
                    inputRef.current.value.trim() !== '' &&
                    item.id !== undefined &&
                    item.id !== null
                  ) {
                    const payload = new FormData()
                    if (subProduct)
                      payload.append(
                        'data',
                        JSON.stringify({
                          product_id: item.id,
                          sub_product_name: inputRef.current.value,
                          description: textareaRef.current.value,
                        })
                      )
                    else
                      payload.append(
                        'data',
                        JSON.stringify({
                          id: item.id,
                          product_name: inputRef.current.value,
                          description: textareaRef.current.value,
                        })
                      )
                    payload.append('file', imageInputRef.current.files[0])
                    onUpdate(payload)
                  }
                } catch (error) {
                  console.log(error)
                }
                setPreview(undefined)
              }
              setIsEditable(!isEditable)
            }}
          />
        </span>
      </div>
    </div>
  )
}

export default ProductCard
