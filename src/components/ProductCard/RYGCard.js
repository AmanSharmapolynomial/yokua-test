import React, { useEffect, useRef, useState } from 'react'
import editIcon from '../../assets/Icon awesome-edit.png'
import saveIcon from '../../assets/ic_save.png'
import placeholder from '../../assets/placeholder.png'
import upload from '../../assets/upload.png'
import { getUserRoles } from '../../utils/token'
import './productcard.css'

const RYGCard = ({ index, item, onClick, onUpdate }) => {
  const [isEditable, setIsEditable] = useState(false)
  const [preview, setPreview] = useState()
  const imageInputRef = useRef(null)
  const inputRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (isEditable) {
      if (textareaRef.current !== null) textareaRef.current.value = item.description
      if (inputRef.current !== null) inputRef.current.value = item.page_title
    }
  }, [isEditable])

  const handleEditClick = e => {
    e.stopPropagation()
    if (isEditable) {
      try {
        if (
          /*inputRef.current.value.trim() !== '' &&*/
          textareaRef.current.value.trim() !== '' &&
          item.id !== undefined &&
          item.id !== null
        ) {
          const payload = new FormData()
          payload.append(
            'data',
            JSON.stringify({
              id: item.id,
              page_title: /*inputRef.current.value*/ item.page_title,
              description: textareaRef.current.value,
            })
          )
          imageInputRef.current.files[0] && payload.append('file', imageInputRef.current.files[0])
          onUpdate(payload)
        }
      } catch (error) {
        console.log(error)
      }
      setPreview(undefined)
    }
    setIsEditable(!isEditable)
  }

  return (
    <div
      onClick={event => {
        !isEditable && onClick()
      }}
      key={item.id}
      role={!isEditable && 'button'}
      className={`product-card col-6 col-lg-4 mt-2 mt-lg-3`}
    >
      <div className="card-md shadow-md p-lg-4 h-100">
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col-12">
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
                        className="img-thumbnail border-black"
                        src={preview ? preview : item?.image_link ? item.image_link : upload}
                        onClick={e => {
                          e.stopPropagation()
                          imageInputRef.current.click()
                        }}
                      />
                    </>
                  ) : (
                    <img
                      className="img-thumbnail border-black"
                      src={item.image_link ? item.image_link : placeholder}
                    />
                  )}
                </div>
                {
                  /*isEditable*/ false ? (
                    <div className="border-black text-center rounded mt-3 product-title clamp-2v">
                      <input ref={inputRef} />
                    </div>
                  ) : (
                    <div className="border-black text-center rounded mt-3 product-title clamp-2v">
                      {item.page_title}
                    </div>
                  )
                }
                {isEditable ? (
                  <textarea
                    ref={textareaRef}
                    className="col-12 d-flex mt-2 product-desc clamp-1v"
                  />
                ) : (
                  <div className="col-12 d-flex mt-2 product-desc p-0 clamp-1v">
                    <p>{item.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {(getUserRoles() == 'PMK Administrator' ||
            getUserRoles() == 'PMK Content Manager' ||
            getUserRoles() == 'Technical Administrator') && (
            <span className="col-auto d-none d-lg-block">
              {isEditable ? (
                <i className="fa-solid fa-floppy-disk theme" onClick={e => handleEditClick(e)} />
              ) : (
                <i className="fa-solid fa-pen-to-square theme" onClick={e => handleEditClick(e)} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default RYGCard
