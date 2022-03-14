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
import { Dropdown, InputGroup, FormControl, Button, Modal, Image } from 'react-bootstrap'

const NewsItem = ({
  data,
  tempCategory,
  tempSubCategory,
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

  const [category, setCategory] = useState(tempCategory)
  const [subCategory, setSubCategory] = useState(tempSubCategory)

  const getCategoryAndSubCategory = () => {
    API.get('news/get_categories').then(data => {
      console.log('Categories', data)
      setSubCategory(data.data.sub_categories)
      setCategory(data.data.categories)
    })
  }

  const [isTopicAdd, setIsTopicAdd] = useState(false)
  const [isSubTopicAdd, setSubTopicAdd] = useState(false)

  const [selectedTopic, setSelectedTopic] = useState('Select Topic')
  const [selectedSubTopic, setSelectedSubTopic] = useState('Select Sub-Topic')

  const [newTopicName, SetNewTopicName] = useState('')
  const [newSubTopicName, SetNewSubTopicName] = useState('')

  const handleSelectTopic = cat => {
    setToggleDropDown(0)
    setSelectedTopic(cat.category_name)
    setCategoryID(cat.id)
  }
  const handleSelectSubTopic = cat => {
    setToggleDropDown(0)
    setSelectedSubTopic(cat.sub_category_name)
    setSubCategoryID(cat.id)
  }

  const _handleEditView = () => {
    setEditView(true)
    setSelectedTopic(category.find(cat => cat.id == data.category_id).category_name)
    setSelectedSubTopic(subCategory.find(cat => cat.id == data.sub_category_id).sub_category_name)
    setCategoryID(data.category_id)
    setSubCategoryID(data.sub_category_id)
  }

  // refs for fields in edit VIew
  const newsDescRef = useRef()
  const fileInputRef = useRef()
  const imageFileInputRef = useRef()

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

  const [newsImage, setNewsImage] = useState(null)
  const [toggleDropDown, setToggleDropDown] = useState(0)

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

        // categoryRef.current.value = data.category_name
        // subCategoryRef.current.value = data.sub_category_name
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
    // document.body.style.overflow = 'scroll'
  }

  const deleteNews = async idArr => {
    const payload = {
      news_id: idArr,
    }
    const afterDeleteMsg = await API.post('/news/delete_news', payload)
    console.log(afterDeleteMsg)
    refreshPage()
  }

  const AddNewCategoryCall = async (image, categoryName) => {
    const payload = {
      // change here to form data
      image,
      data: {
        category_name: categoryName,
      },
    }
    const afterAddMsg = await API.post('news/add_category', payload)
    getCategoryAndSubCategory()
    console.log(afterAddMsg)
  }

  const AddNewSubCategoryCall = async (categoryName, parentCatId = 1) => {
    const payload = {
      sub_category_name: categoryName,
      parent_category_id: parentCatId,
    }
    debugger
    const afterAddMsg = await API.post('news/add_subcategory', payload)
    getCategoryAndSubCategory()
    console.log(afterAddMsg)
  }

  console.log(fileInput?.name)

  const [showCategoryModal, setShowCategoryModal] = useState(false)

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        setShow={setDeleteModal}
        req={'News'}
        title={'Are you sure you want to delete this news?'}
        saveAndExit={saveAndExitModal}
        runDelete={deleteNews}
        data={deleteNewsArr}
      />

      <AddCategoryModal
        setShow={setShowCategoryModal}
        show={showCategoryModal}
        getCategoryAndSubCategory={getCategoryAndSubCategory}
      />
      <div className="single-news-item" key={data ? data.id : Math.random()}>
        <div className="flex-setup">
          <div
            className="dot-adjust"
            onClick={() => {
              // call here the mark as read api
              // const payloadRead = {
              //   news_id: [1],
              // }
              // const markRead = API.post('/news/mark_read', payloadRead)
              // setReadState(false)
            }}
          >
            <div
              className="read-dot"
              style={
                !editView
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
            {editView ? (
              <>
                {/* <input
                  type="file"
                  id="file"
                  // ref={imageFileInputRef}
                  className="inputfile yk-icon-hover"
                  onChange={e => {
                    console.log(e.target.files[0])
                    setNewsImage(e.target.files[0])
                  }}
                /> */}
                <img
                  src={
                    categoryID ? category.find(cat => cat.id == categoryID).image_link : placeholder
                  }
                  // onClick={() => imageFileInputRef.current.click()}
                />
              </>
            ) : (
              <img src={catImg} />
            )}
          </div>

          <div className="news-text">
            <div className="news-info">
              <span className="date">
                {moment(data ? data.date_uploaded : '').format('MMM Do YYYY')}
              </span>

              {editView ? (
                <>
                  <Dropdown
                    show={toggleDropDown == 1}
                    onClick={() =>
                      toggleDropDown == 1 ? setToggleDropDown(0) : setToggleDropDown(1)
                    }
                    size="sm"
                    autoClose={'inside'}
                    className="yk-dropdown-holder"
                    style={{
                      overflow: 'visible',
                    }}
                  >
                    <Dropdown.Toggle
                      size={'sm'}
                      className="yg-custom-dropdown"
                      color="red"
                      id="dropdown-basic"
                    >
                      {selectedTopic}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {category.map((cat, index) => (
                        <Dropdown.Item
                          key={index}
                          className="yg-font-size"
                          onClick={() => handleSelectTopic(cat)}
                        >
                          {cat.category_name}
                        </Dropdown.Item>
                      ))}
                      <Dropdown.Divider />
                      {!isTopicAdd && (
                        <button
                          id="mybtn"
                          className="btn yg-font-size m-2"
                          onClick={() => {
                            setShowCategoryModal(true)
                          }}
                        >
                          Add Topic
                        </button>
                      )}
                      {isTopicAdd && (
                        <InputGroup className="mb-3 yg-font-size p-1 ">
                          <FormControl
                            className="yg-font-size"
                            placeholder="Category"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            value={newTopicName}
                            onChange={e => SetNewTopicName(e.target.value)}
                          />
                          <Button
                            onClick={() => {
                              setIsTopicAdd(false)
                              AddNewCategoryCall(null, newTopicName)
                            }}
                            variant="outline-secondary"
                            className="yg-font-size"
                            id="button-addon2"
                          >
                            Add
                          </Button>
                        </InputGroup>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                  {/* <select
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
                  </select> */}
                </>
              ) : (
                <span className="news-category">{data ? data.category_name : ''}</span>
              )}

              {editView ? (
                <>
                  <Dropdown
                    show={toggleDropDown == 2}
                    onClick={() =>
                      toggleDropDown == 2 ? setToggleDropDown(0) : setToggleDropDown(2)
                    }
                    size="sm"
                    autoClose={'inside'}
                    className={
                      toggleDropDown == 1
                        ? 'yk-dropdown-holder mt-3 yk-dropdown-holder-subtopic'
                        : 'yk-dropdown-holder mt-3'
                    }
                  >
                    <Dropdown.Toggle
                      size={'sm'}
                      className="yg-custom-dropdown"
                      color="red"
                      id="dropdown-basic"
                    >
                      {selectedSubTopic}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {subCategory
                        .filter(item => item.category_id == categoryID)
                        .map((cat, index) => (
                          <Dropdown.Item
                            key={index}
                            className="yg-font-size"
                            onClick={() => handleSelectSubTopic(cat)}
                          >
                            {cat.sub_category_name}
                          </Dropdown.Item>
                        ))}
                      <Dropdown.Divider />
                      {!isSubTopicAdd && (
                        <button
                          id="mybtn"
                          className="btn yg-font-size m-2"
                          onClick={() => {
                            setSubTopicAdd(true)
                          }}
                        >
                          Add Sub-Topic
                        </button>
                      )}
                      {isSubTopicAdd && (
                        <InputGroup className="mb-3 yg-font-size p-1 ">
                          <FormControl
                            className="yg-font-size"
                            placeholder="Sub-Category"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            value={newSubTopicName}
                            onChange={e => SetNewSubTopicName(e.target.value)}
                          />
                          <Button
                            onClick={() => {
                              setSubTopicAdd(false)
                              AddNewSubCategoryCall(newSubTopicName, categoryID)
                            }}
                            variant="outline-secondary"
                            className="yg-font-size"
                            id="button-addon2"
                          >
                            Add
                          </Button>
                        </InputGroup>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                  {/* <select
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
                  </select> */}
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
          <div className="yk-news-edit-icons mb-5">
            {editView
              ? hasPermission && (
                  <i
                    className="fa-solid fa-floppy-disk yk-icon-hover"
                    style={{
                      color: 'var(--bgColor2)',
                      fontSize: '22px',
                      cursor: 'pointer',
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
                            if (fileDetails) {
                              bodyFormData.append('file', fileDetails)
                            }
                            // bodyFormData.append('image', newsI)
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
                                setIsLoading(false)
                                if (response.status == 200) {
                                  toast.success(response.data.message)
                                } else {
                                  toast.error(response.data.message)
                                }
                              })
                              .catch(function (response) {
                                //handle error
                                console.log('Error', response)
                                if (response.status != 200) {
                                  // toast.error(response?.message)
                                  toast.error('Something went wrong')
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
                      fontSize: '22px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      _handleEditView()
                      // change box to edit version
                    }}
                  />
                )}
            {editView && hasPermission ? (
              <i
                className="fa-solid fa-xmark yk-icon-hover"
                style={{
                  fontSize: '22px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setEditView(false)
                  cancelAddNews(data.id)
                }}
              />
            ) : (
              hasPermission && (
                <i
                  className="fa-solid fa-trash"
                  style={{
                    color: '#CD2727',
                    fontSize: '22px',
                    cursor: 'pointer',
                  }}
                  onClick={e => {
                    // call the delete news API here
                    setDeleteNewsArr([data.id])

                    setDeleteModal(true)
                  }}
                />
              )
            )}
          </div>

          <div className="yk-attached-file">
            {editView ? (
              hasPermission && (
                <div className="inputfile-box ">
                  <input
                    accept="application/pdf"
                    type="file"
                    id="file"
                    ref={fileInputRef}
                    className="inputfile yk-icon-hover"
                    onChange={e => {
                      console.log(e.target.files[0])
                      setFileInput(e.target.files[0])
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
                    <span className="file-button yk-icon-hover">
                      <i className="fa-solid fa-paperclip" style={{ fontSize: '22px' }} />
                    </span>
                  </label>
                  <span
                    // className='yk-span'
                    style={{
                      fontSize: '0.7rem',
                    }}
                  >
                    {fileInput?.name}
                    {fileInput && (
                      <i
                        className="fa-solid fa-xmark yk-icon-hover"
                        style={{
                          fontSize: '22px',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setFileInput(null)
                        }}
                      />
                    )}
                  </span>
                </div>
              )
            ) : (
              <div className="attachment-icon">
                {data.attachment_link != '' && (
                  <>
                    <i className="fa-solid fa-file" />
                    <a download href={data ? data.attachment_link : ''}>
                      Read attached file
                    </a>
                  </>
                )}
                {data.attachment_link == '' && (
                  <>
                    <i className="fa-solid fa-file" />
                    <a
                      style={{
                        pointerEvents: 'none',
                        cursor: 'default',
                      }}
                      onClick={() => {
                        toast.warning('File not available')
                      }}
                    >
                      File Not Available
                    </a>
                  </>
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

function AddCategoryModal({ show, setShow, getCategoryAndSubCategory }) {
  const [categoryName, setCategoryName] = useState('')
  const [imageFile, SetImageFile] = useState(null)
  const imageFileInputRef = useRef()

  useEffect(() => {}, [])

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const AddNewCategoryCall = async (image, categoryName) => {
    if (!image) {
      toast.error('Image Required')
      return
    }
    if (!categoryName) {
      toast.error('Category Name Required')
      return
    }
    const data = {
      category_name: categoryName,
    }
    const formData = new FormData()
    formData.append('image', image)
    formData.append('data', JSON.stringify(data))

    const afterAddMsg = await API.post('news/add_category', formData)
    setCategoryName('')
    SetImageFile(null)
    setShow(false)
    getCategoryAndSubCategory()
    console.log(afterAddMsg)
  }

  return (
    <>
      <Modal show={show} centered onHide={handleClose}>
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
          }}
        >
          <Modal.Title>Create Category</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
            flexDirection: 'column',
          }}
        >
          <input
            type="file"
            accept="image/png, image/gif, image/jpeg"
            id="imageFile"
            ref={imageFileInputRef}
            className="inputfile yk-icon-hover"
            onChange={e => {
              console.log(e.target.files[0])
              SetImageFile(e.target.files[0])
            }}
          />
          <Image
            thumbnail={true}
            style={{ maxWidth: '40%' }}
            src={imageFile ? window.URL.createObjectURL(imageFile) : placeholder}
            onClick={() => imageFileInputRef.current.click()}
          />
          <FormControl
            className="yg-font-size mt-4 mb-3"
            placeholder="Enter Category Title"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderTop: '0',
          }}
          centered
        >
          <button
            id="mybtn"
            className="btn btn-background mr-4"
            onClick={() => {
              setCategoryName('')
              SetImageFile(null)
              setShow(false)
            }}
          >
            Cancel
          </button>
          <button
            className="btn"
            onClick={() => {
              AddNewCategoryCall(imageFile, categoryName)
            }}
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
