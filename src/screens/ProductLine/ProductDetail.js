import React, { useEffect, useRef, useState } from 'react'
import Header from '../../components/Header'
import API from '../../utils/api'
import { getToken, getUserRoles } from '../../utils/token'
import './style.css'
import { useLoading } from '../../utils/LoadingContext'
import { useNavigate } from 'react-router'
import { useLocation } from 'react-router-dom'
import Table from '../../components/TableComponent/Table'
import { Modal, Image } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import DeleteModal from '../../components/Modals/Delete Modal/DeleteModal'
import ic_link from '../../assets/link_icon.png'
const ProductDetail = () => {
  const isAdmin =
    getUserRoles() == 'Technical Administrator' ||
    getUserRoles() == 'PMK Administrator' ||
    getUserRoles() == 'PMK Content Manager'

  const navigate = useNavigate()
  const { state } = useLocation()
  const { setLoading } = useLoading()
  const [archivedFilter, setArchivedFilter] = useState(state.is_archived)
  const [isAddComponentModalVisible, setIsAddComponentModalVisible] = useState(-1)
  const [productDetail, setProductDetail] = useState([])
  const [subProductList, setSubProductList] = useState([])
  const [addComponentData, setAddComponentData] = useState({})
  const [inputBinary, setInputBinary] = useState()
  const [showDeleteModal, setShowDeleteModal] = useState({})
  const [isAddSectionModalVisible, setIsAddSectionModalVisible] = useState(false)
  const [isSubProductsModalVisible, setIsSubProductsModalVisible] = useState(false)
  const [isEditable, setIsEditable] = useState(-1)
  const [selectedSubProducts, setSelectedSubproducts] = useState([])
  const [componentToLink, setComponentToLink] = useState({})
  const [expandedAccordian, setExpandedAccordian] = useState(-1)
  const sectionTitleRef = React.useRef(null)
  const accordionRef = React.useRef(null)

  const components = [
    {
      title: 'Add Table',
      type: 'table',
    },
    { title: 'Link', type: 'link' },
    // { title: 'Binary', type: 'binary' },
    { title: 'Description', type: 'description' },
    { title: 'Image', type: 'image' },
  ]

  const columneNames = [
    { title: 'Column Name', key: 'column_name' },
    { title: 'Sort', key: 'is_sortable' },
    { title: 'Date', key: 'is_date' },
    { title: 'Link', key: 'is_link' },
    { title: 'Filter', key: 'is_filterable' },
    { title: 'File', key: 'is_file' },
  ]

  const getProductDetails = () => {
    setLoading(true)
    API.post('products/details/', {
      is_archived: archivedFilter,
      parent_id: state.id,
    })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          setProductDetail(res.data)
        }
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  const updateTableValues = tableObject => {
    setLoading(true)
    let payload = {
      action_type: 'update_cell',
      update_objs: [],
    }
    for (let index = 0; index < tableObject.length; index++) {
      if (tableObject[index].isEdited) {
        const values = tableObject[index].values.filter(value => value.isEdited)
        payload.update_objs.push(...values)
      }
    }
    const formData = new FormData()
    formData.append('data', JSON.stringify(payload))
    API.post('products/page/update_table_data', formData)
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          if (res.data?.message) {
            toast.success(res.data?.message)
          }
        }
        getProductDetails()
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  const linkComponentToSections = () => {
    let data = { ...componentToLink }
    for (let index = 0; index < selectedSubProducts.length; index++) {
      data.section_id = selectedSubProducts[index]
      API.post('products/page/link_component_to_sections', data)
        .then(res => {
          if (res.status === 200 && res.data !== undefined) {
            index === 0 && res.data?.message && toast.success(res.data?.message)
          }
          setIsSubProductsModalVisible(false)
          setComponentToLink({})
          setSelectedSubproducts([])
          index === 0 && setLoading(false)
        })
        .catch(error => {
          console.log(error)
          index === 0 && setLoading(false)
          setIsSubProductsModalVisible(false)
          setComponentToLink({})
          setSelectedSubproducts([])
        })
    }
  }

  const getSubProductsList = () => {
    API.post('products/page/list_sections', {
      is_archived: archivedFilter,
    })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          setSubProductList(res.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const callAddComponentAPI = type => {
    const payload = {
      type: type,
      section_id: productDetail[isAddComponentModalVisible].section_id,
      data: addComponentData,
    }

    let data

    if (type === 'binary' || type === 'image') {
      data = new FormData()
      data.append('file', inputBinary)
      data.append('data', JSON.stringify(payload))
    } else {
      data = { data: JSON.stringify(payload) }
    }

    API.post('/products/page/add_component', data)
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          res.data?.message && toast.success(res.data?.message)
          getProductDetails()
          setIsAddComponentModalVisible(-1)
          setAddComponentData({})
          if (type === 'binary' || type === 'image') setInputBinary()
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const onAddComponentCancel = () => {
    if (accordionRef.current) {
      Array.from(accordionRef.current.querySelectorAll('div.show')).forEach(el =>
        el.classList.remove('show')
      )
    }
    setAddComponentData({})
    setInputBinary()
  }

  const onAddSection = () => {
    API.post('/products/create_section', {
      page_id: state.page_id,
      section_name: sectionTitleRef.current.value,
      order_index: 1,
    })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          res.data?.message && toast.success(res.data?.message)
          getProductDetails()
          setIsAddSectionModalVisible(false)
        }
      })
      .catch(error => {
        setIsAddSectionModalVisible(false)
        console.log(error)
      })
  }

  const onComponentDelete = () => {
    API.post('/products/page/delete_component', showDeleteModal)
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          res.data?.message && toast.success(res.data?.message)
          getProductDetails()
          setShowDeleteModal({})
        }
      })
      .catch(error => {
        setShowDeleteModal({})
        console.log(error)
      })
  }

  const renderType = (ele, idx, arr, section) => {
    if (ele.type === 'binary') {
      return (
        <div className="col-12 mt-4">
          {(getUserRoles() == 'PMK Administrator' ||
            getUserRoles() == 'PMK Content Manager' ||
            getUserRoles() == 'Technical Administrator') &&
            !archivedFilter && (
              <div className="row">
                <div className="ml-auto w-auto my-2 p-0">
                  <Image
                    className="mr-2"
                    style={{ width: '1.4rem' }}
                    role={'button'}
                    src={ic_link}
                    onClick={() => {
                      setIsSubProductsModalVisible(true)
                      setComponentToLink({
                        component_id: ele.id,
                        component_type: ele.type,
                      })
                    }}
                  />
                  <i
                    role={'button'}
                    className="fa-solid fa-trash ml-2 mr-0"
                    onClick={() => {
                      let payload = {
                        section_id: section.section_id,
                        component_id: ele.id,
                        component_type: ele.type,
                      }
                      setShowDeleteModal(payload)
                    }}
                  ></i>
                </div>
              </div>
            )}
          <div className="row">
            {/* <span className="flex-fill">{ele.title}</span> */}
            <a
              className="bordered-btn rounded w-auto"
              role={'button'}
              href={ele.binary_link}
              download
            >
              Download
            </a>
          </div>
        </div>
      )
    } else if (ele.type === 'table') {
      return (
        <Table
          archivedFilter={archivedFilter}
          onEditableClick={() => {
            if (ele.id !== isEditable) setIsEditable(ele.id)
            else setIsEditable(-1)
          }}
          table_name={ele.table_name}
          onLinkClick={() => {
            setIsSubProductsModalVisible(true)
            setComponentToLink({
              component_id: ele.id,
              component_type: ele.type,
            })
          }}
          onDeleteComponent={() => {
            let payload = {
              section_id: section.section_id,
              component_id: ele.id,
              component_type: ele.type,
            }
            setShowDeleteModal(payload)
          }}
          tableObject={ele.table_data}
          setShowDeleteModal={false}
          onRefresh={() => {
            getProductDetails()
          }}
          isTableEditable={ele.id === isEditable}
          isAdmin={isAdmin}
          onTableUpdate={tableObject => {
            updateTableValues(tableObject)
          }}
        />
      )
    } else if (ele.type === 'link') {
      return (
        <div className="col-12 mt-4">
          {(getUserRoles() == 'PMK Administrator' ||
            getUserRoles() == 'PMK Content Manager' ||
            getUserRoles() == 'Technical Administrator') &&
            !archivedFilter && (
              <div className="row">
                <div className="ml-auto w-auto my-2 p-0">
                  <Image
                    className="mr-2"
                    style={{ width: '1.4rem' }}
                    role={'button'}
                    src={ic_link}
                    onClick={() => {
                      setIsSubProductsModalVisible(true)
                      setComponentToLink({
                        component_id: ele.id,
                        component_type: ele.type,
                      })
                    }}
                  />
                  <i
                    role={'button'}
                    className="fa-solid fa-trash ml-2 mr-0"
                    onClick={() => {
                      let payload = {
                        section_id: section.section_id,
                        component_id: ele.id,
                        component_type: ele.type,
                      }
                      setShowDeleteModal(payload)
                    }}
                  ></i>
                </div>
              </div>
            )}
          <div className="row">
            {/* <span className="flex-fill">{ele.title}</span> */}
            <a role={'button'} href={ele.link} target="_blank" className="w-auto p-0">
              {ele.title}
            </a>
          </div>
        </div>
      )
    } else if (ele.type === 'description') {
      return (
        <div className="col-12 mt-4">
          {(getUserRoles() == 'PMK Administrator' ||
            getUserRoles() == 'PMK Content Manager' ||
            getUserRoles() == 'Technical Administrator') &&
            !archivedFilter && (
              <div className="row">
                <div className="ml-auto w-auto my-2 p-0">
                  <Image
                    className="mr-2"
                    style={{ width: '1.4rem' }}
                    role={'button'}
                    src={ic_link}
                    onClick={() => {
                      setIsSubProductsModalVisible(true)
                      setComponentToLink({
                        component_id: ele.id,
                        component_type: ele.type,
                      })
                    }}
                  />
                  <i
                    role={'button'}
                    className="fa-solid fa-trash ml-2 mr-0"
                    onClick={() => {
                      let payload = {
                        section_id: section.section_id,
                        component_id: ele.id,
                        component_type: ele.type,
                      }
                      setShowDeleteModal(payload)
                    }}
                  ></i>
                </div>
              </div>
            )}
          <div className="row">{ele.description}</div>
        </div>
      )
    } else if (ele.type === 'image') {
      if (arr[idx - 1]?.type !== 'image') {
        let IMAGES = []
        for (let index = idx; index < arr.length; index++) {
          const element = arr[index]
          if (element.type === 'image') {
            IMAGES.push(
              <div className={`col-6${index === idx ? ' pl-0' : ''}`}>
                <Image src={ele.image_link} className="border rounded img-product-line" />
              </div>
            )
          } else {
            break
          }
        }
        return (
          <div className="col-12 mt-4">
            {(getUserRoles() == 'PMK Administrator' ||
              getUserRoles() == 'PMK Content Manager' ||
              getUserRoles() == 'Technical Administrator') &&
              !archivedFilter && (
                <div className="row">
                  <div className="ml-auto w-auto my-2 p-0">
                    <Image
                      className="mr-2"
                      style={{ width: '1.4rem' }}
                      role={'button'}
                      src={ic_link}
                      onClick={() => {
                        setIsSubProductsModalVisible(true)
                        setComponentToLink({
                          component_id: ele.id,
                          component_type: ele.type,
                        })
                      }}
                    />
                    <i
                      role={'button'}
                      className="fa-solid fa-trash ml-2 mr-0"
                      onClick={() => {
                        let payload = {
                          section_id: section.section_id,
                          component_id: ele.id,
                          component_type: ele.type,
                        }
                        setShowDeleteModal(payload)
                      }}
                    ></i>
                  </div>
                </div>
              )}
            <div className="row">{IMAGES}</div>
          </div>
        )
      } else {
        return null
      }
    } else if (ele.type === 'image_grid') {
      let IMAGES = []
      for (let index = 0; index < ele.images.length; index++) {
        const element = ele.images[index]
        IMAGES.push(
          <div className={`col-3${index === 0 ? ' pl-0' : ''}`}>
            <Image src={element.image_link} className="border rounded img-product-line" />
          </div>
        )
      }
      return (
        <div className="col-12 mt-4">
          {(getUserRoles() == 'PMK Administrator' ||
            getUserRoles() == 'PMK Content Manager' ||
            getUserRoles() == 'Technical Administrator') &&
            !archivedFilter && (
              <div className="row">
                <div className="ml-auto w-auto my-2 p-0">
                  <Image
                    className="mr-2"
                    style={{ width: '1.4rem' }}
                    role={'button'}
                    src={ic_link}
                    onClick={() => {
                      setIsSubProductsModalVisible(true)
                      setComponentToLink({
                        component_id: ele.images[ele.images.length - 1].id,
                        component_type: 'image',
                      })
                    }}
                  />
                  <i
                    role={'button'}
                    className="fa-solid fa-trash ml-2 mr-0"
                    onClick={() => {
                      let payload = {
                        section_id: section.section_id,
                        component_id: ele.images[ele.images.length - 1].id,
                        component_type: 'image',
                      }
                      setShowDeleteModal(payload)
                    }}
                  ></i>
                </div>
              </div>
            )}
          <div className="row">{IMAGES}</div>
        </div>
      )
    }
  }

  const renderComponents = () =>
    productDetail.map((item, index) => (
      <div className="col-12 mt-5">
        <div className="row">
          <span className="text-bold p-0">{item.sectionName}</span>
        </div>
        <div className="row">
          {item.components.map((ele, idx, arr) => renderType(ele, idx, arr, item))}
        </div>
        {(getUserRoles() == 'PMK Administrator' ||
          getUserRoles() == 'PMK Content Manager' ||
          getUserRoles() == 'Technical Administrator') &&
          !archivedFilter && (
            <div className="row mt-3">
              <button
                className="btn create-domain-btn w-auto"
                onClick={() => {
                  setIsAddComponentModalVisible(index)
                }}
              >
                Add Component
              </button>
            </div>
          )}
      </div>
    ))

  const getFileDisabled = componentArr => {
    let bool = false
    if (componentArr !== undefined) {
      componentArr.every(ele => {
        if (ele.is_file) {
          bool = true
          return
        }
      })
    }
    return bool
  }

  const renderAddTable = () => {
    return (
      <div className="row">
        <div className="input-group my-input-group">
          <div className="input-group-prepend">
            <span className="input-group-text font-8 font-weight-bold">Table Name</span>
          </div>
          <input
            style={{ textTransform: 'capitalize' }}
            onChange={e => {
              setAddComponentData(prevState => {
                return {
                  ...prevState,
                  table_name: e.target.value,
                  title: e.target.value,
                }
              })
            }}
            type="text"
            className="form-control"
            aria-label={'Table Name'}
            aria-describedby="basic-addon1"
          />
        </div>
        <div className="input-group my-input-group">
          <div className="input-group-prepend">
            <span className="input-group-text font-8 font-weight-bold">Add Number of Columns</span>
          </div>
          <input
            onChange={e => {
              // if (parseInt(e.target.value) <= 10)
              setAddComponentData(prevState => {
                return { ...prevState, columnsNum: parseInt(e.target.value) || -1 }
              })
            }}
            type="number"
            min={1}
            // max={10}
            className="form-control"
            aria-label={'Add Number of Columns'}
            aria-describedby="basic-addon1"
          />
        </div>
        {addComponentData?.columnsNum && addComponentData?.columnsNum > 0 && (
          <div className="col-12 font-8">
            <div className="row add-table-row">
              {columneNames.map((item, index) => (
                <div
                  className={`${
                    index === 0 ? 'col-4 add-table-col' : 'col add-table-col text-center p-0'
                  }`}
                >
                  {item.title}
                </div>
              ))}
            </div>
            {[...Array(addComponentData?.columnsNum)].map((e, i) => (
              <div className="row add-table-row d-flex align-items-center">
                {columneNames.map((item, index) =>
                  index === 0 ? (
                    <input
                      style={{ textTransform: 'capitalize' }}
                      className={`${
                        index === 0 ? 'col-4 add-table-col-input' : 'col add-table-col-input'
                      }`}
                      placeholder="column name"
                      onChange={e => {
                        setAddComponentData(prevState => {
                          let state = { ...prevState }
                          if (prevState.table_data === undefined) state.table_data = []
                          state.table_data[i] = {
                            ...state.table_data[i],
                            values: [],
                            [item.key]: e.target.value,
                          }
                          if (state.table_data[i]?.is_sortable === undefined) {
                            state.table_data[i] = {
                              ...state.table_data[i],
                              is_sortable: false,
                            }
                          }
                          if (state.table_data[i]?.is_date === undefined) {
                            state.table_data[i] = {
                              ...state.table_data[i],
                              is_date: false,
                            }
                          }
                          if (state.table_data[i]?.is_link === undefined) {
                            state.table_data[i] = {
                              ...state.table_data[i],
                              is_link: false,
                            }
                          }
                          if (state.table_data[i]?.is_filterable === undefined) {
                            state.table_data[i] = {
                              ...state.table_data[i],
                              is_filterable: false,
                            }
                          }
                          if (state.table_data[i]?.is_file === undefined) {
                            state.table_data[i] = {
                              ...state.table_data[i],
                              is_file: false,
                            }
                          }
                          return state
                        })
                      }}
                    />
                  ) : (
                    <input
                      disabled={
                        ((index === 1 || index === 2 || index === 4 || index === 5) &&
                          addComponentData?.table_data &&
                          addComponentData?.table_data[i]?.is_link) ||
                        (index !== 5 &&
                          addComponentData?.table_data &&
                          addComponentData?.table_data[i] &&
                          addComponentData?.table_data[i]?.is_file) ||
                        (index === 5 &&
                          getFileDisabled(addComponentData?.table_data) &&
                          addComponentData?.table_data &&
                          addComponentData?.table_data[i] &&
                          addComponentData?.table_data[i]?.is_file !== true)
                      }
                      type="checkbox"
                      className={`${index === 0 ? 'col-4' : 'col'}`}
                      onChange={e => {
                        setAddComponentData(prevState => {
                          let state = { ...prevState }
                          if (prevState.table_data === undefined) state.table_data = []
                          state.table_data[i] = {
                            ...state.table_data[i],
                            [item.key]: e.target.checked,
                          }
                          if (item.key === 'is_link' && e.target.checked === true) {
                            state.table_data[i] = {
                              ...state.table_data[i],
                              [columneNames[1].key]: false,
                              [columneNames[2].key]: false,
                              [columneNames[4].key]: false,
                              [columneNames[5].key]: false,
                            }
                          }
                          if (item.key === 'is_file' && e.target.checked === true) {
                            state.table_data[i] = {
                              ...state.table_data[i],
                              [columneNames[1].key]: false,
                              [columneNames[2].key]: false,
                              [columneNames[3].key]: false,
                              [columneNames[4].key]: false,
                            }
                          }
                          return state
                        })
                      }}
                    />
                  )
                )}
              </div>
            ))}
          </div>
        )}
        <div className="col-12 justify-content-center d-flex mt-3">
          <button
            ref={element => {
              if (element) {
                element.style.setProperty('background-color', 'transparent', 'important')
                element.style.setProperty('color', 'var(--bgColor2)', 'important')
              }
            }}
            onClick={() => {
              onAddComponentCancel()
              setExpandedAccordian(-1)
            }}
            className="btn mr-2"
          >
            Cancel
          </button>
          <button
            disabled={
              addComponentData?.table_name === undefined ||
              addComponentData?.table_name === '' ||
              addComponentData?.columnsNum === undefined
            }
            className="btn btn-primary ml-2"
            onClick={() => {
              callAddComponentAPI('table')
            }}
          >
            Create
          </button>
        </div>
      </div>
    )
  }

  const renderAddLink = () => {
    return (
      <div className="row">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text font-8 font-weight-bold" id="basic-addon1">
              {'Title'}
            </span>
          </div>
          <input
            onChange={e => {
              setAddComponentData(prevState => {
                return {
                  ...prevState,
                  title: e.target.value,
                }
              })
            }}
            type="text"
            min={0}
            max={10}
            className="form-control"
            aria-label={'Title'}
            aria-describedby="basic-addon1"
          />
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text font-8 font-weight-bold" id="basic-addon1">
              {'Link'}
            </span>
          </div>
          <input
            onChange={e => {
              setAddComponentData(prevState => {
                return { ...prevState, link: e.target.value }
              })
            }}
            type="url"
            className="form-control"
            aria-label={'Link'}
            aria-describedby="basic-addon1"
          />
        </div>
        <div className="col-12 justify-content-center d-flex mt-3">
          <button
            ref={element => {
              if (element) {
                element.style.setProperty('background-color', 'transparent', 'important')
                element.style.setProperty('color', 'var(--bgColor2)', 'important')
              }
            }}
            onClick={() => {
              onAddComponentCancel()
              setExpandedAccordian(-1)
            }}
            className="btn mr-2"
          >
            Cancel
          </button>
          <button
            disabled={addComponentData?.title === undefined || addComponentData?.link === undefined}
            className="btn btn-primary ml-2"
            onClick={() => {
              callAddComponentAPI('link')
            }}
          >
            Create
          </button>
        </div>
      </div>
    )
  }

  const renderAddBinary = () => {
    return (
      <div className="row">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text font-8 font-weight-bold" id="basic-addon1">
              {'Title'}
            </span>
          </div>
          <input
            onChange={e => {
              setAddComponentData(prevState => {
                return {
                  ...prevState,
                  title: e.target.value,
                }
              })
            }}
            type="text"
            min={0}
            max={10}
            className="form-control"
            aria-label={'Title'}
            aria-describedby="basic-addon1"
          />
        </div>
        <div className="input-group mb-3">
          <div className="custom-file">
            <input
              onChange={e => {
                setInputBinary(e.target.files[0])
              }}
              type="file"
              className="custom-file-input"
              id="inputGroupFile03"
              aria-describedby="inputGroupFileAddon03"
              accept=".zip,.rar,.7zip"
            />
            <label className="custom-file-label font-8 font-weight-bold" htmlFor="inputGroupFile03">
              {inputBinary?.name ? inputBinary?.name : 'Select file'}
            </label>
          </div>
        </div>
        <div className="col-12 justify-content-center d-flex mt-3">
          <button
            ref={element => {
              if (element) {
                element.style.setProperty('background-color', 'transparent', 'important')
                element.style.setProperty('color', 'var(--bgColor2)', 'important')
              }
            }}
            onClick={() => {
              onAddComponentCancel()
              setExpandedAccordian(-1)
            }}
            className="btn mr-2"
          >
            Cancel
          </button>
          <button
            disabled={
              addComponentData?.title === undefined ||
              inputBinary === undefined ||
              inputBinary === null
            }
            className="btn btn-primary ml-2"
            onClick={() => {
              callAddComponentAPI('binary')
            }}
          >
            Create
          </button>
        </div>
      </div>
    )
  }

  const renderAddDescription = () => {
    return (
      <div className="row">
        <div className="input-group mb-3">
          <textarea
            maxLength={100}
            style={{ minHeight: '8rem' }}
            onChange={e => {
              setAddComponentData(prevState => {
                return {
                  ...prevState,
                  description: e.target.value,
                }
              })
            }}
            className="form-control font-8"
            aria-label={'Description'}
            aria-describedby="basic-addon1"
          />
        </div>
        <div className="col-12 justify-content-center d-flex mt-3">
          <button
            ref={element => {
              if (element) {
                element.style.setProperty('background-color', 'transparent', 'important')
                element.style.setProperty('color', 'var(--bgColor2)', 'important')
              }
            }}
            onClick={() => {
              onAddComponentCancel()
              setExpandedAccordian(-1)
            }}
            className="btn mr-2"
          >
            Cancel
          </button>
          <button
            disabled={addComponentData?.description === undefined}
            className="btn btn-primary ml-2"
            onClick={() => {
              callAddComponentAPI('description')
            }}
          >
            Create
          </button>
        </div>
      </div>
    )
  }

  const renderAddImage = () => {
    return (
      <div className="row">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text font-8 font-weight-bold" id="basic-addon1">
              {'Title'}
            </span>
          </div>
          <input
            onChange={e => {
              setAddComponentData(prevState => {
                return {
                  ...prevState,
                  title: e.target.value,
                }
              })
            }}
            type="text"
            className="form-control"
            aria-label={'Title'}
            aria-describedby="basic-addon1"
          />
        </div>
        <div className="input-group mb-3">
          <div className="custom-file">
            <input
              onChange={e => {
                setInputBinary(e.target.files[0])
              }}
              type="file"
              className="custom-file-input"
              id="inputGroupFile03"
              aria-describedby="inputGroupFileAddon03"
              accept="image/*"
            />
            <label className="custom-file-label font-8 font-weight-bold" htmlFor="inputGroupFile03">
              {inputBinary?.name ? inputBinary?.name : 'Select file'}
            </label>
          </div>
        </div>
        <div className="col-12 justify-content-center d-flex mt-3">
          <button
            ref={element => {
              if (element) {
                element.style.setProperty('background-color', 'transparent', 'important')
                element.style.setProperty('color', 'var(--bgColor2)', 'important')
              }
            }}
            onClick={() => {
              onAddComponentCancel()
              setExpandedAccordian(-1)
            }}
            className="btn mr-2"
          >
            Cancel
          </button>
          <button
            disabled={
              addComponentData?.title === undefined ||
              inputBinary === undefined ||
              inputBinary === null
            }
            className="btn btn-primary ml-2"
            onClick={() => {
              callAddComponentAPI('image')
            }}
          >
            Create
          </button>
        </div>
      </div>
    )
  }

  const renderAddModalBody = item => {
    if (item.type === 'table') {
      return renderAddTable(item)
    } else if (item.type === 'link') {
      return renderAddLink(item)
    } else if (item.type === 'binary') {
      return renderAddBinary(item)
    } else if (item.type === 'description') {
      return renderAddDescription(item)
    } else if (item.type === 'image') {
      return renderAddImage(item)
    }
  }

  useEffect(() => {
    getProductDetails()
    ;(getUserRoles() == 'PMK Administrator' ||
      getUserRoles() == 'PMK Content Manager' ||
      getUserRoles() == 'Technical Administrator') &&
      getSubProductsList()
  }, [])

  return (
    <>
      <Header
        isLogedIn={getToken()}
        isAdmin={
          getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'
        }
      />
      <div className="row mx-2 mx-md-5 h-100">
        <div className="col center py-3">
          <div className="row">
            <div className="col-12 col-md-6 border rounded py-2">
              <div className="row">
                <span
                  role="button"
                  className="col-6 light-grey"
                  onClick={() => {
                    navigate(-1)
                  }}
                >
                  Previous page
                </span>
                <span
                  className="col-6"
                  style={{
                    wordBreak: 'break-all',
                  }}
                >
                  <u
                    role="button"
                    onClick={e => {
                      navigate(-2)
                    }}
                  >
                    Product Lines
                  </u>
                  {'>'} {state.sub_product_name}
                </span>
              </div>
            </div>
          </div>
          <>
            <div className="row">{renderComponents()}</div>
            {(getUserRoles() == 'PMK Administrator' ||
              getUserRoles() == 'PMK Content Manager' ||
              getUserRoles() == 'Technical Administrator') &&
              !archivedFilter && (
                <div className="mt-2 d-flex justify-content-center">
                  <button
                    className="btn create-domain-btn mx-auto"
                    onClick={() => {
                      setIsAddSectionModalVisible(true)
                    }}
                  >
                    Add New Section
                  </button>
                </div>
              )}
          </>
        </div>
      </div>
      <Modal
        show={isAddComponentModalVisible !== -1}
        centered
        onHide={() => {
          setIsAddComponentModalVisible(-1)
          setExpandedAccordian(-1)
        }}
      >
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
          }}
        >
          <Modal.Title>List of Components</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div
            className="accordion"
            id="accordionExample"
            style={{ boxShadow: '0 0 20px -5px rgba(0,0,0,0.3)' }}
            ref={accordionRef}
          >
            {components.map((item, idx) => (
              <div className="card border border-secondary">
                <div className="card-header" id="headingOne" style={{ background: '#fff' }}>
                  <div
                    onClick={() => {
                      if (idx === expandedAccordian) setExpandedAccordian(-1)
                      else setExpandedAccordian(idx)
                    }}
                    className="accordian-title d-flex justify-content-between align-items-center font-10"
                    type="button"
                    data-toggle="collapse"
                    data-target={`#collapse${idx}`}
                    aria-expanded="false"
                    aria-controls={`collapse${idx}`}
                  >
                    <span>{item.title}</span>
                    <i
                      className={`fa-solid ${
                        idx === expandedAccordian ? 'fa-angle-up' : 'fa-angle-down'
                      } greyed`}
                    />
                  </div>
                </div>
                <div
                  id={`collapse${idx}`}
                  className="collapse hide"
                  aria-labelledby="headingOne"
                  data-parent="#accordionExample"
                >
                  <div className="card-body">{renderAddModalBody(item)}</div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        {/* <Modal.Footer
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderTop: '0',
          }}
          centered
        >
          <button id="mybtn" className="btn btn-background mr-4" onClick={() => {}}>
            Cancel
          </button>
          <button className="btn" onClick={() => {}}>
            Confirm
          </button>
        </Modal.Footer> */}
      </Modal>
      <Modal
        show={Object.keys(showDeleteModal).length > 0}
        centered
        onHide={() => {
          setShowDeleteModal({})
        }}
      >
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
            textAlign: 'center',
          }}
        >
          <Modal.Title>
            Are you sure you want to delete this{' '}
            {showDeleteModal?.component_type ? showDeleteModal?.component_type : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="mb-5">
            The {showDeleteModal?.component_type ? showDeleteModal?.component_type : ''} will be
            deleted, link can be removed
          </div>
          <div className="col-12 justify-content-center d-flex mt-3">
            <button
              ref={element => {
                if (element) {
                  element.style.setProperty('background-color', 'transparent', 'important')
                  element.style.setProperty('color', 'var(--bgColor2)', 'important')
                }
              }}
              onClick={() => {
                setShowDeleteModal({})
              }}
              className="btn mr-2"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary ml-2"
              onClick={() => {
                onComponentDelete()
              }}
            >
              Confirm
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={isAddSectionModalVisible}
        centered
        onHide={() => {
          setIsAddSectionModalVisible(false)
        }}
      >
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
            textAlign: 'center',
          }}
        >
          <Modal.Title>Add New Section</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="mb-5">
            <input
              ref={sectionTitleRef}
              placeholder="Enter new title"
              type="text"
              className="form-control w-100"
              aria-label={'Title'}
            />
          </div>
          <div className="col-12 justify-content-center d-flex mt-3">
            <button
              ref={element => {
                if (element) {
                  element.style.setProperty('background-color', 'transparent', 'important')
                  element.style.setProperty('color', 'var(--bgColor2)', 'important')
                }
              }}
              onClick={() => {
                setIsAddSectionModalVisible(false)
              }}
              className="btn mr-2"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary ml-2"
              onClick={() => {
                if (sectionTitleRef.current.value.length > 0) {
                  onAddSection()
                } else {
                  toast.error('Please enter section title')
                }
              }}
            >
              Confirm
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={isSubProductsModalVisible}
        centered
        onHide={() => {
          setIsSubProductsModalVisible(false)
          setComponentToLink({})
          setSelectedSubproducts([])
        }}
      >
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
            textAlign: 'center',
          }}
        >
          <Modal.Title>Link Component</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div
            className="accordion"
            id="accordionExample"
            style={{ boxShadow: '0 0 20px -5px rgba(0,0,0,0.3)' }}
            ref={accordionRef}
          >
            {subProductList.map((productList, idx) => {
              return (
                <div className="card border border-secondary">
                  <div className="card-header" id="headingOne" style={{ background: '#fff' }}>
                    <div
                      onClick={() => {
                        if (idx === expandedAccordian) setExpandedAccordian(-1)
                        else setExpandedAccordian(idx)
                      }}
                      className="accordian-title d-flex justify-content-between align-items-center font-10"
                      type="button"
                      data-toggle="collapse"
                      data-target={`#collapse${idx}`}
                      aria-expanded="false"
                      aria-controls={`collapse${idx}`}
                    >
                      <span>{productList.name}</span>
                      <i
                        className={`fa-solid ${
                          idx === expandedAccordian ? 'fa-angle-up' : 'fa-angle-down'
                        } greyed`}
                      />
                    </div>
                  </div>
                  <div
                    id={`collapse${idx}`}
                    className="collapse hide"
                    aria-labelledby="headingOne"
                    data-parent="#accordionExample"
                  >
                    <div className="card-body">
                      {subProductList[idx].sections.map(section => (
                        <div className="py-1 px-3 d-flex">
                          <input
                            checked={selectedSubProducts.indexOf(section.section_id) !== -1}
                            onChange={e => {
                              setSelectedSubproducts(prevState => {
                                let arr = [...prevState]
                                const itemIndex = arr.indexOf(section.section_id)
                                if (itemIndex === -1) {
                                  arr.push(section.section_id)
                                } else {
                                  arr.splice(itemIndex, 1)
                                }
                                return arr
                              })
                            }}
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label className="form-check-label" for="flexCheckDefault">
                            {section.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
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
              setIsSubProductsModalVisible(false)
              setComponentToLink({})
              setSelectedSubproducts([])
            }}
          >
            Cancel
          </button>
          <button
            disabled={selectedSubProducts.length === 0}
            className={`btn${selectedSubProducts.length === 0 ? ' greyed' : ''}`}
            onClick={() => {
              if (selectedSubProducts.length > 0) {
                linkComponentToSections()
              }
            }}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ProductDetail
