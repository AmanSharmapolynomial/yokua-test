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
import { useLoading } from '../../utils/LoadingContext'

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
}) => {
  const { setLoading } = useLoading()
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
    setLoading(true)
    API.get('news/get_categories')
      .then(data => {
        setLoading(false)
        console.log('Categories', data)
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

  const subTopicRef = useRef()
  const topicRef = useRef()

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
        setCatImg(cat.image_link)
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
      toast.error('Please finish current news edit.')
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
  }, [editView, categoryFilter])

  const saveAndExitModal = () => {
    setDeleteModal(false)
    setEditView(false)
    setNewsUnderEdit(false)
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
      isChecked: true,
    }
    setSubCategory([...subCategory, tempSubCatObject])
    handleSelectSubTopic(tempSubCatObject)
  }

  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const uploadCategory = () => {
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
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      } else {
        resolve(null)
      }
    })
  }

  const uploadSubCategory = (categoryId, parentId) => {
    return new Promise((resolve, reject) => {
      if (isNewSubCatAdded) {
        const subPayload = {
          sub_category_name: categoryId,
          parent_category_id: parentId,
        }
        API.post('news/add_subcategory', subPayload)
          .then(data => {
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      } else {
        resolve(null)
      }
    })
  }

  const uploadNewNews = (catId, subCatId) => {
    setLoading(true)

    const subCategoryIds = []
    if (isNewSubCatAdded) {
      subCategoryIds.push(subCatId)
    }
    subCategory
      .filter(item => item.category_id == categoryID)
      .forEach((cat, index) => {
        if (cat.isChecked) {
          subCategoryIds.push(cat.id)
        }
      })

    if (isNewSubCatAdded) {
      subCategoryIds.pop()
    }

    if (!catId || catId == 0) {
      toast.error('Please select Topic')
      return
    } else if (subCategoryIds.length < 1) {
      toast.error('Please select Sub Topic')
      return
    } else {
      const details = JSON.stringify({
        news_id: dataID || null,
        category_id: catId,
        description: newsDesc,
        sub_category_id: subCategoryIds,
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
          setLoading(false)

          if (response.status == 200) {
            setNewsUnderEdit(false)
            setEditView(false)
            refreshPage()
            toast.success(response.data.message)
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
        .catch(function (response) {
          setLoading(false)
          setEditView(false)
          setNewsUnderEdit(false)
          //handle error
          console.log('Error', response)
          if (response.status != 200) {
            // toast.error(response?.message)
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
              uploadNewNews(data.data.id, 0)
            }
          } else {
            console.log('Error Occured')
          }
        })
      } else if (isNewSubCatAdded) {
        uploadSubCategory(subCategory[subCategory.length - 1].sub_category_name, categoryID).then(
          subData => {
            if (subData) {
              setSubCategoryID(subData.data.id)
              uploadNewNews(categoryID, subData.data.id)
            }
          }
        )
      } else {
        uploadNewNews(categoryID, 0)
      }
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
    const updatedSubcategpry = subCategory
    let AllSelected = true
    updatedSubcategpry
      .filter(item => item.category_id == categoryID)
      .forEach((cat, index) => {
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

    setSubCategory(updatedSubcategpry)

    if (AllSelected) {
      setAllSelectChecked(true)
    }
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
    setSubCategory(updatedSubCategories)
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

  return (
    <React.Fragment key={data?.id}>
      <div style={{ width: '400px' }}></div>

      <DeleteModal
        show={deleteModal}
        setShow={setDeleteModal}
        req={'News'}
        title={'Are you sure you want to delete this news?'}
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
              <div className="read-dot" style={{ backgroundColor: 'white' }}></div>
            )}

            {!isCheckListActivated && (
              <div
                className="read-dot"
                onClick={() =>
                  _getNewsReadColor() && !isCheckListActivated && setCheckListActivated(true)
                }
                style={{ backgroundColor: _getNewsReadColor() ? 'var(--bgColor2)' : 'white' }}
              ></div>
            )}
          </div>

          <div className="news-img">
            {editView ? (
              <>
                <img src={catImg} onError={_onErrorImage} />
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
                      width: '12rem',
                    }}
                  >
                    <Dropdown.Toggle
                      size={'sm'}
                      className="yg-custom-dropdown"
                      color="red"
                      id="dropdown-basic"
                      style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {selectedTopic}
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      style={{
                        maxHeight: '14rem',
                        overflowY: 'scroll',
                      }}
                    >
                      {category.map((cat, index) => (
                        <Dropdown.Item key={index} className="yg-font-size">
                          <div className="d-flex justify-content-between p-1">
                            <span onClick={() => handleSelectTopic(cat)}>{cat.category_name}</span>
                            <i
                              className="fa-solid fa-pen-to-square"
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
                        <button
                          style={{ marginLeft: '2rem' }}
                          className="btn yg-font-size"
                          onClick={() => {
                            setToggleDropDown(1)
                            setShowCategoryModal(true)
                            setPreloadedCategoryData(null)
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
                    onClick={() =>
                      toggleDropDown == 2 ? setToggleDropDown(0) : setToggleDropDown(2)
                    }
                    size="sm"
                    autoClose={'outside'}
                    className={
                      toggleDropDown == 1
                        ? 'yk-dropdown-holder mt-3 yk-dropdown-holder-subtopic'
                        : 'yk-dropdown-holder mt-3'
                    }
                    style={{
                      width: '12rem',
                    }}
                  >
                    <Dropdown.Toggle
                      size={'sm'}
                      className="yg-custom-dropdown"
                      color="red"
                      id="dropdown-basic"
                      style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {_getSelectedItems()}
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      style={{
                        maxHeight: '14rem',
                        overflowY: 'scroll',
                      }}
                    >
                      {subCategory
                        .filter(item => item.category_id == categoryID)
                        .map((cat, index) => {
                          if (cat.isEdit) {
                            return (
                              <InputGroup className="mb-3 yg-font-size p-1 ">
                                <FormControl
                                  className="yg-font-size"
                                  placeholder="Sub-Category"
                                  aria-label="Recipient's username"
                                  aria-describedby="basic-addon2"
                                  value={cat.tempSubTopicName}
                                  onChange={e => _updateSubTopicName(e.target.value, cat.id)}
                                />
                                <Button
                                  onClick={() => {
                                    debugger
                                    if (cat.tempSubTopicName) {
                                      _updateSubCategoryAPI(
                                        cat.tempSubTopicName,
                                        cat.id,
                                        categoryID
                                      )
                                      _handleChecked(false)
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
                            )
                          }

                          return (
                            <div className="d-flex justify-content-between p-1 ">
                              <label
                                className="yg-font-size"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyItems: 'center',
                                }}
                              >
                                <input
                                  style={{ marginRight: '8px' }}
                                  type="checkbox"
                                  checked={cat.isChecked}
                                  onChange={() => _handleChecked(cat.id)}
                                />
                                {cat.sub_category_name}
                              </label>
                              <i
                                className="fa-solid fa-pen-to-square"
                                style={{
                                  paddingTop: '2px',
                                  color: 'var(--bgColor2)',
                                  fontSize: '20px',
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  _editSubCategory(cat)
                                  // change box to edit version
                                }}
                              />
                            </div>
                          )
                        })}
                      <Dropdown.Divider />
                      {!isSubTopicAdd && (
                        <button
                          style={{ marginLeft: '1.2rem' }}
                          id="mybtn"
                          className="btn yg-font-size "
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
                              if (newSubTopicName.length != 0) {
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
                </>
              ) : (
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
                      width: '12rem',
                    }}
                  >
                    <Dropdown.Toggle
                      size={'sm'}
                      className="yg-custom-dropdown"
                      color="red"
                      id="dropdown-basic"
                      style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {data?.sub_category &&
                        data.sub_category.length > 0 &&
                        data.sub_category[0].sub_category_name}
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      style={{
                        maxHeight: '14rem',
                        overflowY: 'scroll',
                      }}
                    >
                      {data.sub_category?.map((cat, index) => (
                        <Dropdown.Item key={index} className="yg-font-size">
                          <span>{cat.sub_category_name}</span>
                        </Dropdown.Item>
                      ))}
                      <Dropdown.Divider />
                    </Dropdown.Menu>
                  </Dropdown>
                </>
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
                  height: '188px',
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
                      // call the upsert News API here
                      // const afterUpdateNewsMsg = API.post('news/upsert_news', payloadNews)
                      //   console.log(afterUpdateNewsMsg)
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
                  setNewsUnderEdit(false)
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
                    <a href={data ? data.attachment_link : ''}>Read attached file</a>
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

function AddCategoryModal({
  closeModal,
  show,
  setShow,
  preloadedCategoryData,
  setTempCategoryObject,
  getCategoryAndSubCategory,
}) {
  const [categoryName, setCategoryName] = useState(preloadedCategoryData?.category_name)
  const [imageFile, SetImageFile] = useState(preloadedCategoryData?.image_link)
  const [catImg, setCatImg] = useState(preloadedCategoryData?.image_link)
  const imageFileInputRef = useRef()

  useEffect(() => {
    _setImage()
  }, [])

  const handleClose = () => setShow(false)

  const AddNewCategoryCall = async (image, categoryName) => {
    if (!image) {
      toast.error('Image Required')
      return
    }
    if (!categoryName) {
      toast.error('Category Name Required')
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
      toast.error('Image Required')
      return
    }
    if (!categoryName) {
      toast.error('Category Name Required')
      return
    }

    const formData = new FormData()
    const data = {
      id: preloadedCategoryData?.id,
      category_name: categoryName,
    }
    if (typeof imageFile != 'string') {
      formData.append('image', imageFile)
    }
    formData.append('data', JSON.stringify(data))

    await API.post('news/edit_category', formData)
      .then(data => {
        SetImageFile(null)
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

  const _setImage = () => {
    if (imageFile && imageFile != '') {
      if (!typeof imageFile == 'string') {
        setCatImg(window.URL.createObjectURL(imageFile))
      } else {
        setCatImg(imageFile)
      }
    }
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
              _setImage()
            }}
          />
          <div className="d-flex justify-content-center">
            <Image
              thumbnail={true}
              style={{ maxWidth: '40%' }}
              src={catImg}
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
            className="btn btn-background mr-4"
            onClick={() => {
              debugger
              setCategoryName('')
              SetImageFile(null)
              setShow(p => false)
            }}
          >
            Cancel
          </button>
          <button
            className="btn"
            onClick={() => {
              debugger
              if (preloadedCategoryData) {
                EditCategory()
              } else {
                AddNewCategoryCall(imageFile, categoryName)
              }
            }}
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
