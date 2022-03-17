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
  updateNewsRead,
  readNews,
  setCategoryFilter,
}) => {
  const [catImg, setCatImg] = useState()
  const [editView, setEditView] = useState(false)

  useEffect(() => {
    const outsideClick = document.body.addEventListener('click', () => {
      setToggleDropDown(1)
    })
    return outsideClick
  }, [])

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

  const subTopicRef = useRef()
  const topicRef = useRef()

  const handleSelectTopic = cat => {
    // setToggleDropDown(0)
    topicRef.current.click()
    setSelectedTopic(cat.category_name)
    setCategoryID(cat.id)
    if (cat.image_link === 'string') {
      setCatImg(cat.image_link)
    } else {
      setCatImg(window.URL.createObjectURL(cat.image_link))
    }
  }
  const handleSelectSubTopic = cat => {
    subTopicRef.current.click()
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

  const _onErrorImage = () => {
    setCatImg(placeholder)
  }

  useEffect(() => {
    if (data) {
      category.map((cat, index) => {
        if (cat.id == data.category_id) {
          setCatImg(cat.image_link)
        }
      })
      setReadState(data.news_read)

      if (editView) {
        newsDescRef.current.value = data.description ? data.description : ''

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

  const [isNewCatAdded, setIsNewCatAdded] = useState(false)
  const [isNewSubCatAdded, setIsNewSubCatAdded] = useState(false)

  const AddNewCategoryCall = async (image, categoryName) => {
    setIsNewCatAdded(true)
    const tempCatObject = {
      category_name: categoryName,
      id: Math.random(10000, 200000),
      image_link: image,
    }
    setCategory([...category, tempCatObject])
    handleSelectTopic(tempCatObject)
  }

  const AddNewSubCategoryCall = async (categoryName, parentCatId = 1) => {
    setIsNewSubCatAdded(true)
    const tempSubCatObject = {
      id: Math.random(10000, 200000),
      sub_category_name: categoryName,
      category_id: parentCatId,
    }
    setSubCategory([...subCategory, tempSubCatObject])
    handleSelectSubTopic(tempSubCatObject)
  }

  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const uploadCategory = () => {
    setIsLoading(true)
    return new Promise((resolve, reject) => {
      if (isNewCatAdded) {
        const formData = new FormData()
        const data = {
          category_name: category[category.length - 1].category_name,
        }
        formData.append('image', category[category.length - 1].image_link)
        formData.append('data', JSON.stringify(data))

        API.post('news/add_category', formData)
          .then(data => {
            setIsLoading(false)

            resolve(data)
          })
          .catch(error => {
            setIsLoading(false)

            reject(error)
          })
      } else {
        resolve(null)
      }
    })
  }

  const uploadSubCategory = (categoryId, parentId) => {
    setIsLoading(true)

    return new Promise((resolve, reject) => {
      if (isNewSubCatAdded) {
        const subPayload = {
          sub_category_name: categoryId,
          parent_category_id: parentId,
        }
        API.post('news/add_subcategory', subPayload)
          .then(data => {
            setIsLoading(false)

            resolve(data)
          })
          .catch(error => {
            setIsLoading(false)

            reject(error)
          })
      } else {
        resolve(null)
      }
    })
  }

  const uploadNewNews = (catId, subCatId) => {
    const details = JSON.stringify({
      news_id: dataID || null,
      category_id: catId,
      sub_category_id: [subCatId],
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

  const uploadNews = async () => {
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
          if (isNewCatAdded) {
            uploadCategory().then(data => {
              if (data) {
                setCategoryID(data.data.id)
                if (isNewSubCatAdded) {
                  uploadSubCategory(
                    subCategory[subCategory.length - 1].sub_category_name,
                    data.data.id
                  ).then(subData => {
                    if (subData) {
                      setSubCategoryID(subData.data.id)

                      uploadNewNews(data.data.id, subData.data.id)
                    }
                  })
                } else {
                }
              } else {
              }
            })
          } else if (isNewSubCatAdded) {
            uploadSubCategory(
              subCategory[subCategory.length - 1].sub_category_name,
              data.data.id
            ).then(subData => {
              if (subData) {
                setSubCategoryID(subData.data.id)
                uploadNewNews(categoryID, subData.data.id)
              }
            })
          } else {
            uploadNewNews(categoryID, subCategoryID)
          }
        }
      }

      console.log(bodyFormData.getAll('file'))
      //   file: fileInput ? fileInput : '',
    }
  }

  const _getNewsReadColor = () => {
    if (editView) {
      return false
    }
    if (data?.news_read) {
      return true
    }
    if (readNews.includes(data?.id)) {
      return true
    }
    return false
  }

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
        setTempCategoryObject={(image, data) => AddNewCategoryCall(image, data)}
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
              onClick={() => updateNewsRead()}
              style={{ backgroundColor: _getNewsReadColor() ? 'var(--bgColor2)' : 'white' }}
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
                  src={catImg}
                  onError={_onErrorImage}
                  // onClick={() => imageFileInputRef.current.click()}
                />
              </>
            ) : (
              <img src={catImg} onError={_onErrorImage} />
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
                    ref={topicRef}
                    // show={toggleDropDown == 1}
                    onClick={() => {
                      toggleDropDown == 1 ? setToggleDropDown(0) : setToggleDropDown(1)
                    }}
                    size="sm"
                    autoClose={'outside'}
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

                    <Dropdown.Menu
                      style={{
                        height: '200px',
                        overflowY: 'scroll',
                      }}
                    >
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
                            setToggleDropDown(1)
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
                              setToggleDropDown(0)
                            }}
                            variant="outline-secondary"
                            className="yg-font-size"
                            id="button-addon2"
                          >
                            Save
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
                <span onClick={setCategoryFilter} className="news-category">
                  {data ? data.category_name : ''}
                </span>
              )}

              {editView ? (
                <>
                  <Dropdown
                    ref={subTopicRef}
                    // show={toggleDropDown == 2}
                    onClick={
                      () => (toggleDropDown == 2 ? setToggleDropDown(0) : setToggleDropDown(2))
                      // toggleDropDown == 2 && (isSubTopicAdd || newSubTopicName != '') ? setToggleDropDown(0) : setToggleDropDown(2)
                    }
                    size="sm"
                    autoClose={'outside'}
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
                              if (newSubTopicName.length != 0) {
                                setSubTopicAdd(false)
                                AddNewSubCategoryCall(newSubTopicName, categoryID)
                              } else {
                                toast.error('Please provide Sub Category title')
                              }
                            }}
                            variant="outline-secondary"
                            className="yg-font-size"
                            id="button-addon2"
                          >
                            Save
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
                  minHeight: '24  vh',
                  marginTop: '1rem',
                  height: '200px',
                  resize: 'none',
                }}
                placeholder="Enter description"
                onChange={e => {
                  setNewsDesc(e.target.value)
                }}
              />
            ) : (
              <p
                style={{
                  marginTop: '1rem',
                }}
              >
                {data ? data.description : ''}
              </p>
            )}
          </div>
        </div>

        <div
          className="edit-delete-cta"
          style={{
            marginTop: '0rem',
          }}
        >
          <div className="yk-news-edit-icons mb-5">
            {editView
              ? hasPermission && (
                  <i
                    className="fa-solid fa-floppy-disk yk-icon-hover"
                    style={{
                      color: 'var(--bgColor2)',
                      fontSize: '20px',
                      cursor: 'pointer',
                    }}
                    onClick={async () => {
                      // add save value to a payload
                      // call the save or edit api here
                      uploadNews()
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
                      fontSize: '20px',
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
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setEditView(false)
                  cancelAddNews(data.id)
                  setIsNewCatAdded(false)
                  setIsNewSubCatAdded(false)
                }}
              />
            ) : (
              hasPermission && (
                <i
                  className="fa-solid fa-trash"
                  style={{
                    color: '#CD2727',
                    fontSize: '20px',
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
                <>
                  <div
                    className="inputfile-box "
                    style={{
                      display: 'flex',
                      flexDirection: 'column-reverse',
                    }}
                  >
                    <div>
                      <i
                        className="fa-solid fa-paperclip yk-icon-hover"
                        style={{ fontSize: '22px' }}
                        onClick={() => fileInputRef.current.click()}
                      />
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
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <p
                        className="yk-span"
                        style={{
                          fontSize: '16px',
                        }}
                      >
                        {fileInput?.name}
                      </p>
                      {fileInput && (
                        <i
                          className="fa-solid fa-xmark yk-icon-hover"
                          style={{
                            fontSize: '22px',
                            cursor: 'pointer',
                            alignSelf: 'baseline',
                          }}
                          onClick={() => {
                            setFileInput(null)
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* <label
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
                  /> */}

                  {/* <span
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
                  </span> */}
                </>
              )
            ) : (
              <div className="attachment-icon mb-4">
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

function AddCategoryModal({ show, setShow, getCategoryAndSubCategory, setTempCategoryObject }) {
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

    // const formData = new FormData()
    // formData.append('image', image)
    // formData.append('data', JSON.stringify(data))

    // const afterAddMsg = await API.post('news/add_category', formData)
    setTempCategoryObject(image, categoryName)

    setCategoryName('')
    SetImageFile(null)
    setShow(false)
    // getCategoryAndSubCategory()
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
