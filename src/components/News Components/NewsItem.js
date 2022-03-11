import React, { useEffect, useRef, useState, type } from 'react'
import './style.css'
import placeholder from './placeholder.png'
import moment from 'moment'
import API from '../../utils/api'
import DeleteModal from '../Modals/Delete Modal/DeleteModal'
import axios from 'axios'
import { getToken } from '../../utils/token'
import { toast } from 'react-toastify'

import { getUserRoles } from '../../utils/token'

const NewsItem = ({
  data,
  category,
  subCategory,
  changeType,
  saveAndExitAdd,
  setIsLoading,
  cancelAddNews,
  refreshPage,
}) => {
  const [catImg, setCatImg] = useState()
  const [editView, setEditView] = useState(false)

  const [hasPermission] = useState(
    getUserRoles() == 'PMK Administrator' ||
      getUserRoles() == 'PMK Content Manager' ||
      getUserRoles() == 'Technical Administrator'
  )

  // refs for fields in edit VIew
  const newsDescRef = useRef()
  const fileInputRef = useRef()

  const categoryRef = useRef()
  const subCategoryRef = useRef()

  // states for fields in edit View
  const [newsDesc, setNewsDesc] = useState()
  const [categoryID, setCategoryID] = useState(1)
  const [subCategoryID, setSubCategoryID] = useState(1)
  const [fileInput, setFileInput] = useState()
  const [date, setDate] = useState()
  const [dataID, setDataID] = useState()
  const [readState, setReadState] = useState(true)

  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteNewsArr, setDeleteNewsArr] = useState([])

  useEffect(() => {
    if (changeType == 'Add') {
      setEditView(true)
    }
  }, [])

  useEffect(() => {
    if (data) {
      category.map((cat, index) => {
        if (cat.id == data.category_id) {
          setCatImg(cat.image_link)
        }
      })
      setReadState(data.news_read)

      if (editView) {
        newsDescRef.current.value = data.description

        categoryRef.current.value = data.category_name
        subCategoryRef.current.value = data.sub_category_name
        setNewsDesc(data.description)
        setCategoryID(data.category_id)
        setSubCategoryID(data.sub_category_id)
        setDate(data.date_uploaded)
      }
      if (editView && fileInput) {
        setFileInput(fileInputRef.current.files[0])
      }
      setDataID(data.id)
    }
  }, [editView])

  const saveAndExitModal = () => {
    setDeleteModal(false)
    setEditView('')
    document.body.style.overflow = 'scroll'
  }

  const deleteNews = idArr => {
    const payload = {
      news_id: idArr,
    }
    const afterDeleteMsg = API.post('/news/delete_news', payload)
    console.log(afterDeleteMsg)
  }

  const AddNewCategoryCall = (image, categoryName) => {
    const payload = {
      // change here to form data
      image,
      data: {
        category_name: categoryName,
      },
    }
    const afterAddMsg = API.post('news/add_category', payload)
    console.log(afterAddMsg)
  }

  const AddNewSubCategoryCall = (categoryName, parentCatId) => {
    const payload = {
      sub_category_name: categoryName,
      parent_category_id: parentCatId,
    }
    const afterAddMsg = API.post('news/add_subcategory', payload)
    console.log(afterAddMsg)
  }

  console.log(fileInput?.name)

  return (
    <React.Fragment>
      {deleteModal && (
        <DeleteModal
          req={'News'}
          title={'Are you sure you want to delete this news?'}
          saveAndExit={saveAndExitModal}
          runDelete={deleteNews}
          data={deleteNewsArr}
        />
      )}
      <div className="single-news-item" key={data ? data.id : Math.random()}>
        <div className="flex-setup">
          <div
            className="dot-adjust"
            onClick={() => {
              // call here the mark as read api
              const payloadRead = {
                news_id: [1],
              }
              const markRead = API.post('/news/mark_read', payloadRead)
              setReadState(false)
            }}
          >
            <div
              className="read-dot"
              style={
                editView
                  ? {
                      backgroundColor: '',
                    }
                  : {
                      backgroundColor: readState ? 'var(--bgColor2)' : '',
                    }
              }
            ></div>
          </div>

          <div className="news-img">
            {editView ? <img src={placeholder} /> : <img src={catImg} />}
          </div>

          <div className="news-text">
            <div className="news-info">
              <span className="date">
                {moment(data ? data.date_uploaded : '').format('MMM Do')}
              </span>

              {editView ? (
                <>
                  {/* <input
                    type={'text'}
                    list={'subCatList'}
                    ref={categoryRef}
                    onChange={e => {
                      category.map(cat => {
                        if (cat.category_name == e.target.value) {
                          setCategoryID(cat.id)
                        } else {
                          setCategoryID(null)
                        }
                      })
                    }}
                  />
                  {console.log(subCategoryID)}
                  <datalist id="subCatList">
                    {category.map((cat, index) => (
                      <option key={index}>{cat.category_name}</option>
                    ))}
                  </datalist> */}

                  {/* <div className="btn-group select-font-size">
                    <button
                      className="btn  btn-sm dropdown-toggle select-news-bootstrap select-font-size select-border"
                      type="button"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Small
                    </button>
                    <div className="dropdown-menu select-font-size">
                      {category.map((cat, index) => (
                        <option key={index}>{cat.category_name}</option>
                      ))}
                      <button className={'btn align-middle'} onClick={() => {}}>
                        Live News
                      </button>
                    </div>
                  </div> */}
                  <select
                    className="select-news"
                    ref={categoryRef}
                    onChange={e => {
                      category.map(cat => {
                        if (cat.category_name == e.target.value) {
                          setCategoryID(cat.id)
                        }
                      })
                    }}
                  >
                    {category.map((cat, index) => (
                      <option key={index}>{cat.category_name}</option>
                    ))}
                  </select>
                </>
              ) : (
                <span className="news-category">{data ? data.category_name : ''}</span>
              )}

              {editView ? (
                <>
                  {/* <input
                    type={'text'}
                    list={'subCatList'}
                    ref={subCategoryRef}
                    onChange={e => {
                      subCategory.map((cat, index) => {
                        if (cat.sub_category_name == e.target.value) {
                          setSubCategoryID(cat.id)
                        } else {
                          setSubCategoryID(null)
                        }
                      })
                    }}
                  />
                  {console.log(subCategoryID)}
                  <datalist id="subCatList">
                    {subCategory.map((cat, index) => (
                      <option key={index}>{cat.sub_category_name}</option>
                    ))}
                  </datalist> */}
                  <select
                    className="select-news"
                    ref={subCategoryRef}
                    onChange={e => {
                      subCategory.map((cat, index) => {
                        if (cat.sub_category_name == e.target.value) {
                          setSubCategoryID(cat.id)
                        }
                      })
                    }}
                  >
                    {subCategory.map((cat, index) => (
                      <option key={index}>{cat.sub_category_name}</option>
                    ))}
                  </select>
                </>
              ) : (
                <span className="news-info-text">{data ? data.sub_category_name : ''}</span>
              )}
            </div>
          </div>
          <div className="news-desc">
            {editView ? (
              <textarea
                ref={newsDescRef}
                style={{
                  minWidth: '100%',
                  minHeight: '15vh',
                  marginTop: '1rem',
                }}
                placeholder="Subject"
                onChange={e => {
                  setNewsDesc(e.target.value)
                }}
              />
            ) : (
              <p>{data ? data.description : ''}</p>
            )}
          </div>
        </div>

        <div className="edit-delete-cta">
          <div className="news-edit-icons">
            {editView
              ? hasPermission && (
                  <i
                    className="fa-solid fa-floppy-disk"
                    style={{
                      color: 'var(--bgColor2)',
                    }}
                    onClick={() => {
                      // add save value to a payload
                      // call the save or edit api here
                      if (newsDescRef.current.value == '') {
                        toast.error('Enter some description to add or edit news')
                      } else {
                        setIsLoading(true)
                        if (categoryID == null) {
                          // call category add api
                        } else {
                          if (subCategoryID == null) {
                            // call subcategory add api
                          } else {
                            const details = JSON.stringify({
                              news_id: dataID || null,
                              category_id: categoryID,
                              sub_category_id: subCategoryID,
                              description: newsDesc,
                            })
                            const fileDetails = fileInputRef?.current?.files[0]
                            var bodyFormData = new FormData()
                            bodyFormData.append('data', details)
                            bodyFormData.append('file', fileDetails)
                            const token = getToken()
                            axios({
                              method: 'post',
                              url: 'https://yokogawa-flow-center.herokuapp.com/news/upsert_news',
                              data: bodyFormData,
                              headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Bearer ${token}`,
                              },
                            })
                              .then(function (response) {
                                //handle success
                                console.log(response)
                                if (response.status == 200) {
                                  toast.success(response.data.message)

                                  setIsLoading(false)
                                }
                              })
                              .catch(function (response) {
                                //handle error
                                console.log(response)
                                if (response.status != 200) {
                                  toast.error(response?.data?.message)
                                }
                                setIsLoading(false)
                              })
                          }
                        }

                        console.log(bodyFormData.getAll('file'))
                        //   file: fileInput ? fileInput : '',
                      }
                      console.log(bodyFormData.getAll('file'))
                      // call the upsert News API here
                      // const afterUpdateNewsMsg = API.post('news/upsert_news', payloadNews)
                      //   console.log(afterUpdateNewsMsg)
                      if (!changeType) {
                        setEditView(false)
                      } else if (changeType == 'Add') {
                        // window.location.reload()
                        saveAndExitAdd()
                      }
                    }}
                  />
                )
              : hasPermission && (
                  <i
                    className="fa-solid fa-pen-to-square"
                    style={{
                      color: 'var(--bgColor2)',
                    }}
                    onClick={() => {
                      setEditView(true)
                      // change box to edit version
                    }}
                  />
                )}
            {editView && hasPermission ? (
              <i
                className="fa-solid fa-xmark"
                onClick={() => {
                  cancelAddNews(data.id)
                }}
              />
            ) : (
              hasPermission && (
                <i
                  className="fa-solid fa-trash"
                  style={{
                    color: '#CD2727',
                  }}
                  onClick={e => {
                    // call the delete news API here
                    setDeleteNewsArr([data.id])
                    document.body.scrollTop = 0
                    document.documentElement.scrollTop = 0
                    document.body.style.overflow = 'hidden'
                    setDeleteModal(true)
                  }}
                />
              )
            )}
          </div>

          <div className="attached-file">
            {editView ? (
              hasPermission && (
                <div className="inputfile-box">
                  <input
                    type="file"
                    id="file"
                    ref={fileInputRef}
                    className="inputfile"
                    onChange={() => {
                      console.log(fileInputRef.current.files[0])
                      setFileInput(fileInputRef.current.files[0])
                    }}
                  />
                  <label
                    htmlFor="file"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span id="file-name" className="file-box"></span>
                    <span className="file-button">
                      <i className="fa-solid fa-paperclip" />
                    </span>
                  </label>
                  <span
                    style={{
                      fontSize: '0.7rem',
                    }}
                  >
                    {fileInput?.name}
                  </span>
                </div>
              )
            ) : (
              <div className="attachment-icon">
                {data.attachment_link != '' ? (
                  <>
                    <i className="fa-solid fa-file" />
                    <a download href={data ? data.attachment_link : ''}>
                      Read attached file
                    </a>
                  </>
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default NewsItem
