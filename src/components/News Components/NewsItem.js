import React, { useEffect, useRef, useState } from 'react'
import './style.css'
import placeholder from './placeholder.png'
import moment from 'moment'
import API from '../../utils/api'
import DeleteModal from '../Modals/Delete Modal/DeleteModal'
import { toast } from 'react-toastify'

import { getUserRoles, getToken } from '../../utils/token'
import { Dropdown, InputGroup, FormControl, Button, Modal, Image } from 'react-bootstrap'
import { useLoading } from '../../utils/LoadingContext'
import { useNavigate } from 'react-router'
import ReactCrop from 'react-image-crop'
import Tooltip from '@mui/material/Tooltip'
import 'react-image-crop/dist/ReactCrop.css'

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
  categoryFilter,
  isAnyNewsUnderEdit,
  setNewsUnderEdit,
  setCheckListActivated,
  isCheckListActivated,
  archivedFilter,
  index,
}) => {
  const { setLoading } = useLoading()
  const [catImg, setCatImg] = useState()
  const [editView, setEditView] = useState(false)

  // useEffect(() => {
  //   const outsideClick = document.body.addEventListener('click', () => {
  //     setToggleDropDown(1)
  //     if (Object.prototype.toString.call(subTopicRef?.current?.classList) === '[object Array]') {
  //       SetNewSubTopicName('')
  //       setSubTopicAdd(false)
  //     }
  //     // if ((subTopicRef?.current?.classList) .includes('show')) {
  //     //   debugger
  //     // }
  //   })
  //   return outsideClick
  // }, [])

  const [hasPermission] = useState(
    getUserRoles() == 'PMK Administrator' ||
      getUserRoles() == 'PMK Content Manager' ||
      getUserRoles() == 'Technical Administrator'
  )

  const [category, setCategory] = useState(tempCategory)
  const [subCategory, setSubCategory] = useState(tempSubCategory)

  const getCategoryAndSubCategory = () => {
    setLoading(true)
    API.get('news/get_categories')
      .then(data => {
        setLoading(false)
        setSubCategory(data.data.sub_categories)
        setCategory(data.data.categories)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  const [isTopicAdd, setIsTopicAdd] = useState(false)
  const [isSubTopicAdd, setSubTopicAdd] = useState(false)

  const [selectedTopic, setSelectedTopic] = useState('Select Topic')
  const [selectedSubTopic, setSelectedSubTopic] = useState('Select Sub-Topic')

  const [newTopicName, SetNewTopicName] = useState('')
  const [newSubTopicName, SetNewSubTopicName] = useState('')
  const navigate = useNavigate()
  const subTopicRef = useRef()
  const topicRef = useRef()

  useEffect(() => {}, [editView])

  const handleSelectTopic = cat => {
    setAllSelectChecked(false)
    // setToggleDropDown(0)
    topicRef.current.click()
    setSelectedTopic(cat.category_name)
    setCategoryID(cat.id)

    setSelectedSubTopic('Select Sub-Topic')
    setSubCategoryID(0)
    if (cat.image_link && cat.image_link != '') {
      if (typeof cat.image_link == 'string') {
        setCatImg(cat.image_link + `?token=${getToken()}`)
      } else {
        setCatImg(window.URL.createObjectURL(cat.image_link))
      }
    }
  }
  const handleSelectSubTopic = cat => {
    setToggleDropDown(0)
    setSelectedSubTopic(cat.sub_category_name)
    setSubCategoryID(cat.id)
  }

  const _handleEditView = () => {
    if (!isAnyNewsUnderEdit) {
      _checkBoxEditView()
      setNewsUnderEdit(true)
      setEditView(true)
      setSelectedTopic(category.find(cat => cat.id == data.category_id).category_name)
      // setSelectedSubTopic(subCategory.find(cat => cat.id == data.sub_category_id).sub_category_name)
      setCategoryID(data.category_id)
      setSubCategoryID(data.sub_category_id)
    } else {
      toast.error('Please complete the current news entry')
    }
  }

  // refs for fields in edit VIew
  const newsDescRef = useRef()
  const fileInputRef = useRef()

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

  const [toggleDropDown, setToggleDropDown] = useState(0)

  useEffect(() => {
    if (changeType == 'Add') {
      setEditView(true)
    }
  }, [])

  const _onErrorImage = () => {
    setCatImg(placeholder)
  }

  // useEffect(() => {
  //   category.map((cat, index) => {
  //     if (cat.id == data.category_id) {
  //       setCatImg(cat.image_link)
  //     }
  //   })
  // }, [catImg])

  useEffect(() => {
    if (data) {
      category.map((cat, index) => {
        if (cat.id == data.category_id) {
          setCatImg(cat.image_link + `?token=${getToken()}`)
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
  }, [editView, categoryFilter, data])

  const saveAndExitModal = () => {
    setDeleteModal(false)
    setEditView(false)
    setNewsUnderEdit(false)
    document.body.style.overflow = 'auto'
  }

  const deleteNews = async idArr => {
    const payload = {
      news_id: idArr,
    }
    const afterDeleteMsg = await API.post('/news/delete_news', payload)
    refreshPage()
  }

  const [isNewCatAdded, setIsNewCatAdded] = useState(false)
  const [isNewSubCatAdded, setIsNewSubCatAdded] = useState(false)
  const AddNewCategoryCall = async (image, categoryName, data) => {
    setIsNewCatAdded(true)
    const tempCatObject = {
      category_name: categoryName,
      id: data.data.id,
      image_link: image,
    }
    setCategory([...category, tempCatObject])
    handleSelectTopic(tempCatObject)
  }

  const AddNewSubCategoryCall = async (categoryName, parentCatId = 1, data) => {
    const tempSubCatObject = {
      id: data.data.id,
      sub_category_name: categoryName,
      category_id: parentCatId,
      isChecked: true,
    }
    console.log('The new object formed', tempSubCatObject)
    setSubCategory([...subCategory, tempSubCatObject])
    handleSelectSubTopic(tempSubCatObject)
    SetNewSubTopicName('')
  }

  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const uploadCategory = (image, categoryName) => {
    const formData = new FormData()
    const data = {
      category_name: categoryName,
    }
    formData.append('image', image)
    formData.append('data', JSON.stringify(data))

    API.post('news/add_category', formData)
      .then(data => {
        AddNewCategoryCall(image, categoryName, data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const uploadSubCategory = (categoryName, parentCatId = 1, categoryId, parentId) => {
    const subPayload = {
      sub_category_name: categoryName,
      parent_category_id: parentCatId,
    }
    API.post('news/add_subcategory', subPayload)
      .then(data => {
        AddNewSubCategoryCall(newSubTopicName, categoryID, data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const uploadNewNews = catId => {
    setLoading(true)

    const subCategoryIds = []
    subCategory
      .filter(item => item.category_id == categoryID)
      .forEach((cat, index) => {
        if (cat.isChecked) {
          subCategoryIds.push(cat.id)
        }
      })

    // if (isNewSubCatAdded) {
    //   subCategoryIds.pop()
    // }

    if (!catId || catId == 0) {
      toast.error('Please select a topic')
      setLoading(false)
      return
    } else if (subCategoryIds.length < 1) {
      toast.error('Please select a sub-topic')
      setLoading(false)
      return
    } else {
      const details = JSON.stringify({
        news_id: dataID || null,
        category_id: catId,
        description: newsDesc,
        sub_category_id: subCategoryIds,
      })

      const fileDetails = fileInputRef?.current?.files[0]
      let bodyFormData = new FormData()
      bodyFormData.append('data', details)
      if (fileDetails) {
        bodyFormData.append('file', fileDetails)
      }

      API.post('news/upsert_news', bodyFormData)
        .then(response => {
          //  handle success
          setLoading(false)
          if (response.status == 200) {
            setNewsUnderEdit(false)
            setEditView(false)
            refreshPage()
            toast.success(response.data.message, {
              autoClose: 1500,
              pauseOnHover: false,
            })

            setTimeout(() => navigate(0), 1500)
            if (!changeType) {
            } else if (changeType == 'Add') {
              // window.location.reload()
              saveAndExitAdd()
              setEditView(false)
            }
          } else {
            setEditView(false)
            setNewsUnderEdit(false)
            toast.error(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
          setLoading(false)
          setEditView(false)
          setNewsUnderEdit(false)
          //handle error
          if (response.status != 200) {
            response?.message && toast.error(response?.message)
            // toast.error('Session expired')
          }
        })
    }
  }

  const uploadNews = async () => {
    setLoading(true)
    if (newsDescRef.current.value == '') {
      toast.error('Enter some description to add or edit news')
      return
    } else {
      // if (isNewCatAdded) {
      //   uploadCategory().then(data => {
      //     if (data) {
      //       setCategoryID(data.data.id)
      //       if (isNewSubCatAdded) {
      //         uploadSubCategory(
      //           subCategory[subCategory.length - 1].sub_category_name,
      //           data.data.id
      //         ).then(subData => {
      //           if (subData) {
      //             setSubCategoryID(subData.data.id)
      //             uploadNewNews(data.data.id, subData.data.id)
      //           }
      //         })
      //       } else {
      //         uploadNewNews(data.data.id, 0)
      //       }
      //     } else {
      //     }
      //   })
      // } else if (isNewSubCatAdded) {
      //   uploadSubCategory(subCategory[subCategory.length - 1].sub_category_name, categoryID).then(
      //     subData => {
      //       if (subData) {
      //         setSubCategoryID(subData.data.id)
      //         uploadNewNews(categoryID, subData.data.id)
      //       }
      //     }
      //   )
      // } else {
      uploadNewNews(categoryID)
      // }
    }
  }

  const _getNewsReadColor = () => {
    if (editView) {
      return true
    }
    if (data?.news_read) {
      return false
    }
    if (readNews.includes(data?.id)) {
      return false
    }
    return true
  }

  const [isAllSelectChecked, setAllSelectChecked] = useState(false)
  const _handleAllChecked = isChecked => {
    setAllSelectChecked(isChecked)
    const updatedSubcategpry = subCategory
    updatedSubcategpry
      .filter(item => item.category_id == categoryID)
      .forEach((cat, index) => {
        cat.isChecked = isChecked
      })

    setSubCategory(updatedSubcategpry)
  }

  const _handleChecked = id => {
    let AllSelected = true
    setSubCategory(prevState => {
      const filtered = prevState.filter(item => item.category_id == categoryID)
      filtered.forEach((cat, index) => {
        if (cat.id == id) {
          cat.isChecked = !cat.isChecked
          if (!cat.isChecked) {
            setAllSelectChecked(false)
          }
        }

        if (!cat.isChecked) {
          AllSelected = false
        }
      })

      if (AllSelected) {
        setAllSelectChecked(true)
      }
      return filtered
    })
  }
  useEffect(() => {
    _checkAllChecked()
  }, [subCategory, isAllSelectChecked])

  useEffect(() => {
    _checkBoxEditView()
  }, [editView])

  const _checkAllChecked = () => {
    const updatedSubcategpry = subCategory
    let AllSelected = true
    updatedSubcategpry
      .filter(item => item.category_id == categoryID)
      .forEach((cat, index) => {
        if (!cat.isChecked) {
          AllSelected = false
        }
      })

    if (AllSelected) {
      setAllSelectChecked(true)
    } else {
      setAllSelectChecked(false)
    }
  }

  const _getSelectedItems = () => {
    let commaSeparated = ''
    subCategory
      .filter(item => item.category_id == categoryID && item.isChecked)
      .forEach((cat, index) => {
        commaSeparated += ' ' + cat.sub_category_name + ','
      })
    if (commaSeparated != '') {
      return commaSeparated.slice(0, -1)
    } else {
      return 'Select Sub Category'
    }
  }

  const _checkBoxEditView = () => {
    const updatedSubcategpry = subCategory
    const tempCat = subCategory
    tempCat.forEach((cat, index) => {
      cat.isChecked = false
    })
    setSubCategory(tempCat)
    if (data?.sub_category?.length > 0) {
      data.sub_category.map(x => {
        updatedSubcategpry
          .filter(item => item.category_id == categoryID)
          .forEach((cat, index) => {
            if (x.sub_category_id == cat.id) {
              cat.isChecked = true
            }
          })
      })
    }

    setSubCategory(() => [...updatedSubcategpry])
  }

  const [preloadedCategoryData, setPreloadedCategoryData] = useState(null)

  const _editSubCategory = (cat = null) => {
    if (isSubTopicAdd) {
      toast.error('Please save the current entry first')
      return
    }
    const updatedSubCategories = subCategory
    updatedSubCategories.forEach(item => {
      if (cat) {
        if (item.id == cat.id) {
          item.isEdit = true
          item.tempSubTopicName = cat.sub_category_name
        } else {
          item.isEdit = false
        }
      } else {
        item.isEdit = false
      }
    })
    setSubCategory([...updatedSubCategories])
  }

  const _updateSubTopicName = (name, id) => {
    const updatedSubCategories = subCategory
    updatedSubCategories.forEach(item => {
      if (item.id == id) {
        item.tempSubTopicName = name
      }
    })

    setSubCategory([...updatedSubCategories])
  }

  const _updateSubCategoryAPI = async (name, id, parent) => {
    await API.post('news/edit_subcategory', {
      sub_category_id: id,
      sub_category_name: name,
      parent_category_id: parent,
    })
      .then(data => {
        _editSubCategory()
        getCategoryAndSubCategory()
      })
      .catch(error => {})
  }

  const _checkIsEditSubTopicOpen = () => {
    const items = subCategory.filter(item => item.isEdit)
    return items.length > 0 ? true : false
  }

  const renderSubCategory = () => {
    if (data?.sub_category !== undefined && data?.sub_category?.length > 1) {
      return (
        <div className="accordion" id="accordionExample">
          <div
            className="card"
            style={{
              zIndex: 1,
              position: 'absolute',
              backgroundColor: 'white',
            }}
          >
            <div className="card-header px-2 py-2" id="headingTwo" style={{ borderBottom: 'none' }}>
              <div
                className="collapsed d-flex align-items-center justify-content-between"
                type="button"
                data-toggle="collapse"
                data-target={`#collapse${index}`}
                aria-expanded="false"
                aria-controls={`collapse${index}`}
              >
                <div>
                  {data?.sub_category[0] !== undefined
                    ? data?.sub_category[0]['sub_category_name']
                    : ''}
                </div>
                <i className="fa-solid fa-angle-down theme ms-3" />
              </div>
            </div>
            <div
              id={`collapse${index}`}
              className="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordionExample"
            >
              <div className="card-body p-0">
                {data?.sub_category.map((item, index) => {
                  return index !== 0 && <div className="px-2 py-2">{item.sub_category_name}</div>
                })}
              </div>
            </div>
          </div>
        </div>
        // <div className="dropdown">
        //   <div
        //     className="dropdown-toggle"
        //     type="button"
        //     id="dropdownMenuButton"
        //     data-toggle="dropdown"
        //     aria-haspopup="true"
        //     aria-expanded="false"
        //   >
        //     {data?.sub_category[0] !== undefined ? data?.sub_category[0]['sub_category_name'] : ''}
        //   </div>
        //   <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        //     {data?.sub_category.map((item, index) => {
        //       return <div>{item.sub_category_name}</div>
        //     })}
        //   </div>
        // </div>
      )
    } else if (data?.sub_category && data?.sub_category[0] !== undefined) {
      return data?.sub_category[0]['sub_category_name']
    } else {
      return ''
    }
  }

  return (
    <React.Fragment key={data?.id}>
      <DeleteModal
        show={deleteModal}
        setShow={setDeleteModal}
        req={'News'}
        title={`Are you sure you want to delete this news from ${moment(
          data ? data.date_uploaded : ''
        ).format('MMM DD')}?`}
        isBold={true}
        saveAndExit={saveAndExitModal}
        runDelete={deleteNews}
        data={deleteNewsArr}
      />
      <AddCategoryModal
        closeModal={() => setShowCategoryModal(false)}
        key={data.id}
        preloadedCategoryData={preloadedCategoryData}
        setShow={setShowCategoryModal}
        show={showCategoryModal}
        getCategoryAndSubCategory={getCategoryAndSubCategory}
        setTempCategoryObject={(image, data) => {
          uploadCategory(image, data)
        }}
      />
      <div className="single-news-item col-12 mb-3" key={data ? data.id : Math.random()}>
        <div className="row">
          <div className="col-12 col-lg-10">
            <div className="row">
              {!archivedFilter && (
                <div
                  className="dot-adjust col-auto mx-lg-1"
                  onClick={() => {
                    // call here the mark as read api
                    // const payloadRead = {
                    //   news_id: [1],
                    // }
                    // const markRead = API.post('/news/mark_read', payloadRead)
                    // setReadState(false)
                  }}
                >
                  {isCheckListActivated && !data?.news_read && (
                    <>
                      <input
                        style={{ marginRight: '8px', width: '1.3rem', height: '1.3rem' }}
                        type="checkbox"
                        checked={readNews.includes(data.id) ? true : false}
                        onChange={() => updateNewsRead()}
                      />
                    </>
                  )}
                  {isCheckListActivated && data?.news_read && (
                    <div
                      className="read-dot mb-auto mt-2"
                      style={{ backgroundColor: 'white' }}
                    ></div>
                  )}

                  {!isCheckListActivated && (
                    <div
                      className="read-dot mb-auto mt-2"
                      onClick={() =>
                        _getNewsReadColor() && !isCheckListActivated && setCheckListActivated(true)
                      }
                      style={{ backgroundColor: _getNewsReadColor() ? 'var(--bgColor2)' : 'white' }}
                    ></div>
                  )}
                </div>
              )}

              <div className="ps-0 col d-lg-none d-block">
                <div className="row">
                  <div onClick={setCategoryFilter} className="news-category-sm col">
                    {data ? data.category_name : ''}
                  </div>
                  <div className="date-sm col-auto ps-0">
                    {moment(data ? data.date_uploaded : '').format('MMM Do YYYY')}
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="news-sub-category-sm">{renderSubCategory()}</div>
                </div>
              </div>

              <div
                className="col-12 col-lg-3 p-sm-0 p-lg-auto mt-2 mt-lg-0 news-item-image-card"
                style={{
                  width: '23rem',
                  height: 'auto',
                }}
              >
                <div className="news-img rounded mx-lg-3">
                  <img
                    src={catImg ? catImg : placeholder}
                    onError={_onErrorImage}
                    placeholder={placeholder}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
              <div className="col col-lg-2">
                <div className="news-info d-none d-lg-flex">
                  <span className="date">
                    {moment(data ? data.date_uploaded : '').format('MMM Do YYYY')}
                  </span>
                  {editView ? (
                    <div
                      ref={topicRef}
                      className="dropdown yk-dropdown-holder border btn-group"
                      // style={{
                      //   width: '12rem',
                      // }}
                    >
                      <div
                        role={'button'}
                        className="yg-custom-dropdown"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        data-display="static"
                        aria-hidden="true"
                      >
                        <div className="d-flex justify-content-between">
                          <a
                            style={{
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {selectedTopic}
                          </a>
                          <i
                            className="fa fa-caret-down ms-2 align-self-center"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>

                      <div
                        className="dropdown-menu"
                        style={{
                          maxHeight: '14rem',
                          overflowY: 'scroll',
                        }}
                      >
                        {category.map((cat, index) => (
                          <Dropdown.Item key={index} className="yg-font-size">
                            <div className="d-flex justify-content-between p-1">
                              <span onClick={() => handleSelectTopic(cat)}>
                                {cat.category_name}
                              </span>
                              <i
                                className="fa-solid fa-pen-to-square ms-2"
                                style={{
                                  alignSelf: 'flex-end',
                                  color: 'var(--bgColor2)',
                                  fontSize: '20px',
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  setPreloadedCategoryData(p => cat)
                                  setToggleDropDown(1)
                                  setShowCategoryModal(true)
                                  // change box to edit version
                                }}
                              />
                            </div>
                          </Dropdown.Item>
                        ))}
                        <Dropdown.Divider />
                        {!isTopicAdd && (
                          <div className="col d-flex justify-content-center">
                            <button
                              className="btn yg-font-size"
                              onClick={() => {
                                setToggleDropDown(1)
                                setShowCategoryModal(true)
                                setPreloadedCategoryData(null)
                              }}
                            >
                              Add Topic
                            </button>
                          </div>
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

                                uploadCategory(null, newTopicName)
                                setToggleDropDown(0)
                              }}
                              variant="outline-secondary"
                              className="yg-font-size ms-2"
                              id="button-addon2"
                            >
                              Save
                            </Button>
                          </InputGroup>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span onClick={setCategoryFilter} className="news-category">
                      {data ? data.category_name : ''}
                    </span>
                  )}

                  {editView ? (
                    <div
                      ref={subTopicRef}
                      className={
                        toggleDropDown == 1
                          ? 'dropdown yk-dropdown-holder mt-3 yk-dropdown-holder-subtopic border btn-group'
                          : 'dropdown yk-dropdown-holder mt-3 border btn-group'
                      }
                      // style={{
                      //   width: '12rem',
                      // }}
                    >
                      <div
                        role={'button'}
                        className="yg-custom-dropdown"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        data-display="static"
                        aria-hidden="true"
                      >
                        <div className="d-flex justify-content-between">
                          <a
                            style={{
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {_getSelectedItems()}
                          </a>
                          <i
                            className="fa fa-caret-down ms-2 align-self-center"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>

                      <div
                        className="dropdown-menu"
                        style={{
                          maxHeight: '14rem',
                          overflowY: 'scroll',
                        }}
                      >
                        <div className="d-flex justify-content-between p-1">
                          <label
                            className="yg-font-size"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyItems: 'center',
                            }}
                          >
                            <input
                              style={{ marginRight: '8px', width: 'auto', textTransform: 'none' }}
                              type="checkbox"
                              checked={isAllSelectChecked}
                              onChange={() => {
                                _handleAllChecked(!isAllSelectChecked)
                              }}
                            />
                            {'Select all'}
                          </label>
                        </div>
                        {subCategory
                          .filter(item => item.category_id == categoryID)
                          .map((cat, index) => {
                            if (cat.isEdit) {
                              return (
                                <InputGroup className="mb-3 yg-font-size p-1 ">
                                  <div className="position-relative align-items-center">
                                    <FormControl
                                      className="yg-font-size"
                                      placeholder="Sub-Category"
                                      aria-label="Recipient's username"
                                      aria-describedby="basic-addon2"
                                      value={cat.tempSubTopicName}
                                      onChange={e => _updateSubTopicName(e.target.value, cat.id)}
                                    />
                                    <i
                                      className="position-absolute mt-2 fa-solid fa-xmark yk-icon-hover"
                                      style={{
                                        right: 5,
                                        top: 0,
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                      }}
                                      onClick={e => {
                                        _editSubCategory()
                                      }}
                                    />
                                  </div>
                                  <Button
                                    onClick={() => {
                                      if (cat.tempSubTopicName) {
                                        _updateSubCategoryAPI(
                                          cat.tempSubTopicName,
                                          cat.id,
                                          categoryID
                                        )
                                        _handleChecked(false)
                                      } else {
                                        toast.error('Please provide a sub-category title')
                                      }
                                    }}
                                    variant="outline-secondary"
                                    className="yg-font-size ms-2"
                                    id="button-addon2"
                                  >
                                    Save
                                  </Button>
                                </InputGroup>
                              )
                            }

                            return (
                              <div className="d-flex justify-content-between p-1">
                                <label
                                  className="yg-font-size"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyItems: 'center',
                                  }}
                                >
                                  <input
                                    style={{ marginRight: '8px', width: 'auto' }}
                                    type="checkbox"
                                    checked={cat.isChecked}
                                    onChange={() => _handleChecked(cat.id)}
                                  />
                                  {cat.sub_category_name}
                                </label>
                                <i
                                  className="fa-solid fa-pen-to-square ms-2"
                                  style={{
                                    paddingTop: '2px',
                                    color: 'var(--bgColor2)',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                  }}
                                  onClick={e => {
                                    e.stopPropagation()
                                    _editSubCategory(cat)
                                    // change box to edit version
                                  }}
                                />
                              </div>
                            )
                          })}
                        <Dropdown.Divider />
                        {!isSubTopicAdd && (
                          <div className="col d-flex justify-content-center">
                            <button
                              id="mybtn"
                              className="btn yg-font-size "
                              onClick={e => {
                                e.stopPropagation()
                                if (_checkIsEditSubTopicOpen()) {
                                  toast.error('Please close the edit of the current sub-category')
                                } else {
                                  SetNewSubTopicName('')
                                  setSubTopicAdd(true)
                                }
                              }}
                            >
                              Add Subtopic
                            </button>
                          </div>
                        )}
                        {isSubTopicAdd && (
                          <InputGroup className="mb-3 yg-font-size p-1 ">
                            <div className="position-relative align-items-center">
                              <FormControl
                                className="yg-font-size"
                                placeholder="Sub-Category"
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                value={newSubTopicName}
                                onChange={e => SetNewSubTopicName(e.target.value)}
                              />
                              <i
                                className="position-absolute mt-2 fa-solid fa-xmark yk-icon-hover"
                                style={{
                                  right: 5,
                                  top: 0,
                                  fontSize: '20px',
                                  cursor: 'pointer',
                                }}
                                onClick={e => {
                                  e.stopPropagation()
                                  SetNewSubTopicName('')
                                  setSubTopicAdd(false)
                                }}
                              />
                            </div>
                            <Button
                              onClick={() => {
                                SetNewSubTopicName('')
                                setSubTopicAdd(false)
                                if (newSubTopicName.length != 0) {
                                  console.log('New sub topic name', newSubTopicName)
                                  console.log('Cat ID', categoryID)
                                  console.log('sub cat', subCategory)
                                  uploadSubCategory(
                                    newSubTopicName,
                                    categoryID
                                    // subCategory[subCategory.length - 1].sub_category_name
                                    // data.data.id
                                  )
                                  // AddNewSubCategoryCall()
                                } else {
                                  toast.error('Please provide a sub-category title')
                                }
                              }}
                              variant="outline-secondary"
                              className="yg-font-size ms-2"
                              id="button-addon2"
                            >
                              Save
                            </Button>
                          </InputGroup>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="news-sub-category">{renderSubCategory()}</span>
                  )}
                </div>
              </div>
              <div className="news-desc col-12 col-md">
                {editView ? (
                  <textarea
                    ref={newsDescRef}
                    placeholder="Enter description"
                    onChange={e => {
                      setNewsDesc(e.target.value)
                    }}
                  />
                ) : (
                  <p style={{ whiteSpace: 'pre-wrap' }}>{data ? data.description : ''}</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-2 align-items-end flex-column d-none d-lg-flex">
            <div className="yk-news-edit-icons mb-5">
              {editView
                ? hasPermission && (
                    <Tooltip title="Save Changes">
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
                          // call the upsert News API here
                          // const afterUpdateNewsMsg = API.post('news/upsert_news', payloadNews)
                          //   console.log(afterUpdateNewsMsg)
                        }}
                      />
                    </Tooltip>
                  )
                : hasPermission && (
                    <Tooltip title="Edit News">
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
                    </Tooltip>
                  )}
              {editView && hasPermission ? (
                <Tooltip title="Discard Changes">
                  <i
                    className="fa-solid fa-xmark yk-icon-hover mx-2"
                    style={{
                      fontSize: '20px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setNewsUnderEdit(false)
                      setEditView(false)
                      cancelAddNews(data.id)
                      setIsNewCatAdded(false)
                      setIsNewSubCatAdded(false)
                    }}
                  />
                </Tooltip>
              ) : (
                hasPermission && (
                  <Tooltip title="Delete News">
                    <i
                      className="fa-solid fa-trash mx-2"
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
                  </Tooltip>
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
                        <Tooltip title="Attach a Document">
                          <i
                            className="fa-solid fa-paperclip yk-icon-hover"
                            style={{ fontSize: '22px' }}
                            onClick={() => fileInputRef.current.click()}
                          />
                        </Tooltip>
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
                  {data.attachment_link !== '' && (
                    <>
                      <i className="fa-solid fa-file" />
                      <a
                        target="_blank"
                        href={data ? data.attachment_link + `?token=${getToken()}` : ''}
                      >
                        Read attached file
                      </a>
                    </>
                  )}
                  {/* {data.attachment_link == '' && (
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
                  )} */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default NewsItem

function AddCategoryModal({
  closeModal,
  show,
  setShow,
  preloadedCategoryData,
  setTempCategoryObject,
  getCategoryAndSubCategory,
}) {
  const [categoryName, setCategoryName] = useState(preloadedCategoryData?.category_name)
  const [imageFile, SetImageFile] = useState(
    preloadedCategoryData?.image_link ? preloadedCategoryData?.image_link : null
  )
  const [catImg, setCatImg] = useState(preloadedCategoryData?.image_link)
  const imageFileInputRef = useRef()
  const [showCropModal, setShowCropModal] = useState(false)
  const [crop, setCrop] = useState(
    // default crop config
    {
      unit: '%',
      width: 30,
      aspect: 1.77 / 1,
    }
  )
  const [imageRef, setImageRef] = useState()
  const [aspect, setAspect] = useState(1)
  const [croppedImage, setCroppedImage] = useState(null)
  const [imageToCrop, setImageToCrop] = useState(null)
  const [finalCroppedImageFile, setFinalCroppedImageFile] = useState(null)
  const [dragged, setDragged] = useState(false)
  // const [cropState, setCropState] = useState(false)

  async function cropImage(crop) {
    if (imageRef && crop.width && crop.height) {
      const croppedImage = await retrieveCroppedImage(
        imageRef,
        crop,
        'croppedImage.jpeg' // destination filename
      )

      // calling the props function to expose
      // croppedImage to the parent component
      if (croppedImage) setCroppedImage(croppedImage)
    }
  }

  const handleCropModalClose = () => {
    setShowCropModal(false)
  }

  useEffect(() => {
    _setImage()
  }, [imageFile])

  useEffect(() => {
    setCategoryName(preloadedCategoryData?.category_name)
    SetImageFile(preloadedCategoryData?.image_link ? preloadedCategoryData?.image_link : null)
    setCatImg(preloadedCategoryData?.image_link)
  }, [preloadedCategoryData])

  const handleClose = () => setShow(false)

  const AddNewCategoryCall = async (image, categoryName) => {
    if (!image) {
      toast.error('An image is required')
      return
    }
    if (!categoryName) {
      toast.error('Category name is required')
      return
    }

    setTempCategoryObject(image, categoryName)

    setCategoryName('')
    SetImageFile(null)
    setShow(false)
    closeModal()
  }

  const EditCategory = async () => {
    if (!imageFile) {
      toast.error('An image is required')
      return
    }
    if (!categoryName) {
      toast.error('Category name is required')
      return
    }

    const formData = new FormData()
    const data = {
      id: preloadedCategoryData?.id,
      category_name: categoryName,
    }
    if (typeof finalCroppedImageFile != 'string') {
      formData.append('image', finalCroppedImageFile)
    }
    formData.append('data', JSON.stringify(data))

    await API.post('news/edit_category', formData)
      .then(data => {
        SetImageFile(null)
        setCroppedImage(null)
        setFinalCroppedImageFile(null)
        closeModal()
        toast.success(data.data.message)
        setShow(false)
        getCategoryAndSubCategory()
      })
      .catch(error => {
        closeModal()
        SetImageFile(null)
        setShow(false)
      })
  }

  const _setImage = (image = null) => {
    let finalImage = imageFile
    if (image) {
      finalImage = image
    }
    if (typeof finalImage == 'string' && finalImage != '') {
      setCatImg(finalImage)
      return
    }
    if (finalImage && !(typeof finalImage == 'string')) {
      setCatImg(window.URL.createObjectURL(finalImage))
    } else if (finalImage == null) {
      setCatImg(placeholder)
    } else {
      setCatImg(imageFile)
    }
  }

  function retrieveCroppedImage(sourceImage, crop, fileName) {
    // creating the cropped image from the source image
    const canvas = document.createElement('canvas')

    const scaleX = sourceImage.naturalWidth / sourceImage.width
    const scaleY = sourceImage.naturalHeight / sourceImage.height

    canvas.width = Math.ceil(crop.width * scaleX)
    canvas.height = Math.ceil(crop.height * scaleY)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      sourceImage,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        // returning an error
        if (!blob) {
          reject(new Error('Canvas is empty'))
          return
        }

        if (dragged) {
          blob.name = fileName
          // creating a Object URL representing the Blob object given
          var file = new File([blob], 'image.png', { type: 'image/png' })
          console.log('GENERATED IMAGE', file)
          setFinalCroppedImageFile(file)
          const croppedImageUrl = window.URL.createObjectURL(blob)
          setDragged(false)
          resolve(croppedImageUrl)
        } else {
          resolve(false)
        }
      }, 'image/png')
    })
  }

  const renderImageCropModal = () => {
    return (
      <Modal show={showCropModal && imageToCrop} onHide={handleCropModalClose}>
        <Modal.Header style={{ justifyContent: 'center' }}>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {imageToCrop && (
            <ReactCrop
              src={imageToCrop}
              crop={crop}
              onImageLoaded={imageRef => setImageRef(imageRef)}
              onComplete={crop => cropImage(crop)}
              onChange={crop => setCrop(crop)}
              onDragStart={() => {
                setDragged(true)
              }}
            />
          )}
          {/* <ReactCrop
              crop={crop}
              onChange={setCrop}
              aspect={aspect}
              //onComplete={c => setCompletedCrop(c)}
            >
              <img
                src={URL.createObjectURL(image)}
                //style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                //onLoad={onImageLoad}
              />
            </ReactCrop> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCropModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCropModalClose} disabled={croppedImage == null}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  const handleImageChange = event => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader()

      reader.addEventListener('load', () => {
        const image = reader.result

        setImageToCrop(image)
      })

      reader.readAsDataURL(event.target.files[0])
      //SetImageFile(event.target.files[0])
      //_setImage(event.target.files[0])
      setShowCropModal(true)
    }
    setShowCropModal(true)
    //renderImageCropModal(image)
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
          <Modal.Title>{preloadedCategoryData ? 'Edit Category' : 'Create Category'}</Modal.Title>
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
            //ref={imageRef}
            className="inputfile yk-icon-hover"
            onChange={e => {
              handleImageChange(e)
            }}
          />
          <div className="d-flex justify-content-center w-100">
            <Image
              thumbnail={true}
              style={{ maxWidth: '40%', width: 'auto' }}
              //src={catImg ? catImg : placeholder}
              src={
                croppedImage
                  ? croppedImage
                  : catImg + `?token=${getToken()}`
                  ? catImg + `?token=${getToken()}`
                  : placeholder
              }
              onError={() => setCatImg(placeholder)}
              onClick={() => imageFileInputRef.current.click()}
            />
          </div>
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
            className="btn btn-background me-4"
            onClick={() => {
              setCategoryName('')
              setShow(p => false)
              SetImageFile(null)
              setCroppedImage(null)
              setImageToCrop(null)
              setFinalCroppedImageFile(null)
            }}
          >
            Cancel
          </button>
          {croppedImage != null && (
            <button
              id="crop-btn"
              className="btn btn-background me-4"
              onClick={() => {
                setShowCropModal(true)
              }}
            >
              Crop Image
            </button>
          )}
          <button
            className="btn"
            onClick={() => {
              if (preloadedCategoryData) {
                EditCategory()
              } else {
                AddNewCategoryCall(finalCroppedImageFile, categoryName)
              }
            }}
          >
            Confirm
          </button>
        </Modal.Footer>
        {showCropModal && renderImageCropModal()}
      </Modal>
    </>
  )
}
