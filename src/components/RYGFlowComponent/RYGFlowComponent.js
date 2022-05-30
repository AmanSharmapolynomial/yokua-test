import React from 'react'
import { Image } from 'react-bootstrap'
import placeholder from '../../assets/placeholder.png'
import upload from '../../assets/upload.png'

const RYGFlowComponent = ({ data, isAdmin = false, ...props }) => {
  const [isEditable, setEditable] = React.useState(false)
  const [preview, setPreview] = React.useState()
  const binaryRef = React.useRef(null)
  const imageInputRef = React.useRef(null)
  const descRef = React.useRef(null)

  React.useEffect(() => {
    if (isEditable) {
      if (descRef.current !== null) descRef.current.value = data.description
    }
  }, [isEditable])

  return (
    <div className="col-12 mt-4">
      <div className="row">
        <div className="card-md shadow-md">
          <div className="row px-md-3 py-md-3">
            <div className="col-12 col-md">
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
                    className="img-thumbnail img-ryg"
                    src={preview ? preview : data?.image_link ? data.image_link : upload}
                    onClick={e => {
                      e.stopPropagation()
                      imageInputRef.current.click()
                    }}
                  />
                </>
              ) : (
                <img
                  className="img-thumbnail img-ryg"
                  src={data.image_link ? data.image_link : placeholder}
                />
              )}
              <div className="row mt-3">
                {isEditable ? (
                  <label
                    ref={ref => {
                      if (ref) {
                        ref.style.setProperty('font-size', '1rem', 'important')
                      }
                    }}
                    role={'button'}
                    className="bordered-btn rounded w-auto mx-auto"
                    for="binary"
                  >
                    <input ref={binaryRef} id="binary" type="file" class="d-none" />
                    Upload
                  </label>
                ) : (
                  <>
                    <a
                      ref={ref => {
                        if (ref) {
                          ref.style.setProperty('font-size', '1rem', 'important')
                        }
                      }}
                      className="bordered-btn rounded w-auto mx-auto"
                      role={'button'}
                      href={data.binary_link}
                      download
                      style={{ textDecoration: 'none' }}
                    >
                      Download now
                    </a>
                    <p
                      className="text-center mt-2"
                      style={{ fontSize: '0.8rem', fontWeight: '500' }}
                    >
                      ({data.binary_title})
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="col-12 col-md">
              {isEditable ? (
                <textarea
                  style={{
                    width: '100%',
                    height: '100%',
                    resize: 'none',
                  }}
                  ref={descRef}
                  placeholder="Enter description"
                />
              ) : (
                <p>{data ? data.description : ''}</p>
              )}
            </div>
            {isAdmin && (
              <div className="col-auto my-2 p-0 d-none d-md-block">
                <i
                  role={'button'}
                  className={
                    !isEditable
                      ? 'fa-solid fa-pen-to-square me-2 theme'
                      : 'fa-solid fa-floppy-disk theme'
                  }
                  onClick={() => {
                    if (isEditable) {
                      const payload = []

                      if (
                        descRef.current.value !== data.description &&
                        descRef.current.value.trim() !== ''
                      ) {
                        const formData = new FormData()
                        formData.append(
                          'data',
                          JSON.stringify({
                            id: data.description_id,
                            component_type: 'description',
                            description: descRef.current.value,
                          })
                        )
                        payload.push(formData)
                      }
                      if (imageInputRef.current.files[0]) {
                        const formData = new FormData()
                        formData.append('file', imageInputRef.current.files[0])
                        formData.append(
                          'data',
                          JSON.stringify({
                            id: data.image_id,
                            component_type: 'image',
                            description: '',
                          })
                        )
                        payload.push(formData)
                      }
                      if (binaryRef.current.files[0]) {
                        const formData = new FormData()
                        formData.append('file', binaryRef.current.files[0])
                        formData.append(
                          'data',
                          JSON.stringify({
                            id: data.binary_id,
                            component_type: 'binary',
                            title: data.binary_title,
                          })
                        )
                        payload.push(formData)
                      }
                      props.onUpdate(payload)
                      setEditable(false)
                    } else {
                      setEditable(true)
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RYGFlowComponent
