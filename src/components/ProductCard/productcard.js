import React, { useEffect, useRef, useState } from 'react'
import editIcon from '../../assets/Icon awesome-edit.png'
import saveIcon from '../../assets/ic_save.png'
import placeholder from '../../assets/placeholder.png'
import upload from '../../assets/upload.png'
import archiveIcon from '../../assets/archive.png'
import { getUserRoles } from '../../utils/token'
import './productcard.css'
import { Modal } from 'react-bootstrap'

const ProductCard = ({
  index,
  item,
  onClick,
  subProduct,
  onUpdate,
  isAdmin,
  onArchiveClick,
  archive,
}) => {
  const [showArchiveModal, setShowArchiveModal] = useState(false)
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
      className={`product-card col-12 col-md-6 mt-3`}
    >
      <div className="card shadow px-3 py-3 h-100">
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col-6" style={{ padding: '0 20px' }}>
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
                    <div className="border-black text-center rounded mt-2">
                      <input ref={inputRef} />
                    </div>
                  ) : (
                    <div
                      className="border-black text-center rounded mt-2"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        wordBreak: 'break-word',
                      }}
                    >
                      {subProduct ? item.sub_product_name : item.name}
                    </div>
                  )
                }
              </div>

              {isEditable ? (
                <textarea ref={textareaRef} className="col-6 d-flex align-items-center" />
              ) : (
                <div className="col-6 d-flex align-items-center" style={{ wordBreak: 'break-all' }}>
                  {item.description}
                </div>
              )}
            </div>
          </div>
          {(getUserRoles() == 'PMK Administrator' ||
            getUserRoles() == 'PMK Content Manager' ||
            getUserRoles() == 'Technical Administrator') &&
            !archive && (
              <span className="col-auto d-none d-md-block">
                {!subProduct && (
                  <img
                    className="me-3"
                    src={archiveIcon}
                    onClick={e => {
                      e.stopPropagation()
                      setShowArchiveModal(true)
                      // onArchiveClick()
                    }}
                  />
                )}
                <img
                  src={isEditable ? saveIcon : editIcon}
                  onClick={e => {
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
                          if (subProduct)
                            payload.append(
                              'data',
                              JSON.stringify({
                                id: item.id,
                                product_id: item.product_id,
                                sub_product_name: /* inputRef.current.value*/ item.sub_product_name,
                                description: textareaRef.current.value,
                              })
                            )
                          else
                            payload.append(
                              'data',
                              JSON.stringify({
                                id: item.id,
                                product_name: /*inputRef.current.value*/ item.name,
                                description: textareaRef.current.value,
                              })
                            )
                          imageInputRef.current.files[0] &&
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
            )}
        </div>
      </div>
      <Modal centered show={showArchiveModal}>
        <Modal.Body>
          <div className="modal-wrapper">
            <h5
              className="modal-heading"
              style={{
                marginBottom: 0,
              }}
            >
              Are you sure you want to move archive
            </h5>
            <div
              className="modal-content domain-modal"
              style={{
                border: '0',
                margin: 0,
              }}
            >
              <span
                style={{
                  padding: '1rem',
                }}
              >
                The {subProduct ? item.sub_product_name : item.name} product will be move to archive
              </span>

              <div className="domain-modal-cta">
                <button
                  className="cancel-domain btn"
                  onClick={e => {
                    e.stopPropagation()
                    setShowArchiveModal(false)
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn"
                  onClick={e => {
                    e.stopPropagation()
                    onArchiveClick()
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ProductCard
