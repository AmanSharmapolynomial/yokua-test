import React, { useEffect, useRef, useState } from 'react'
import Header from '../../components/Header'
import API from '../../utils/api'
import { getToken, getUserRoles } from '../../utils/token'
import { useLoading } from '../../utils/LoadingContext'
import { useNavigate } from 'react-router'
import { Link, useLocation } from 'react-router-dom'
import Table from '../../components/TableComponent/Table'
import { Modal, Image } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import DeleteModal from '../../components/Modals/Delete Modal/DeleteModal'
import ic_link from '../../assets/link_icon.png'
import RYGFlowComponent from '../../components/RYGFlowComponent/RYGFlowComponent'
import htmlParser from 'html-react-parser'
import Tooltip from '@mui/material/Tooltip'
import * as XLSX from 'xlsx'
import { jsonOpts, readOpts } from '../../config/xlsx.js'

const RYGDetail = () => {
  const queryString = window.location.search
  // const queryStringTwo = queryString.substring(queryString.indexOf('?') + 1);
  // console.log(queryStringTwo)
  const urlParams = new URLSearchParams(queryString)
  const rygId = urlParams.get('rygId')
  const rygPageId = urlParams.get('rygPageId')
  const rygPageTitle = urlParams.get('rygPageTitle')
  // console.log(rygPageTitle)
  const decodedRygPageTitle = decodeURIComponent(rygPageTitle)
  // console.log(decodedRygPageTitle)
  const regex = /rygPageTitle=(.*?)&rygId/
  const match = queryString.match(regex)
  const extractedString = match ? match[1] : null
  // console.log(extractedString)

  // Decode the extracted string
  const decodedString = extractedString ? decodeURIComponent(extractedString) : null
  // console.log(decodedString)

  const [state, setNewState] = useState({
    page_title: decodedString,
    page_id: Number(rygPageId),
    id: Number(rygId),
  })

  const isAdmin =
    getUserRoles() == 'Technical Administrator' ||
    getUserRoles() == 'PMK Administrator' ||
    getUserRoles() == 'PMK Content Manager'

  const navigate = useNavigate()
  //const { state } = useLocation()
  const { setLoading } = useLoading()
  const [isAddComponentModalVisible, setIsAddComponentModalVisible] = useState(-1)
  const [productDetail, setProductDetail] = useState([])
  const [subProductList, setSubProductList] = useState([])
  // const [addComponentData, setAddComponentData] = useState({})
  const [inputBinary, setInputBinary] = useState()
  const [isUploadModalVisible, setUploadModalVisible] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState({})
  const [isAddSectionModalVisible, setIsAddSectionModalVisible] = useState(false)
  const [isSubProductsModalVisible, setIsSubProductsModalVisible] = useState(false)
  const [isEditable, setIsEditable] = useState(-1)
  const [selectedSubProducts, setSelectedSubproducts] = useState([])
  const [componentToLink, setComponentToLink] = useState({})
  const [expandedAccordian, setExpandedAccordian] = useState(-1)
  const [isMd, setIsMd] = useState(false)
  const [imagesToUpload, setImagesToUpload] = useState([])
  const [isImageGridEditable, setIsImageGridEditable] = useState([])
  const sectionTitleRef = React.useRef(null)
  const sectionFileRef = React.useRef(null)
  const accordionRef = React.useRef(null)
  const [tableId, settableId] = useState(null)
  const [extractedData, setExtractedData] = useState([])
  const [editableBulk, setEditableBulk] = useState(true)

  function updateWindowDimensions() {
    if (window.innerWidth >= 768) setIsMd(true)
    else setIsMd(false)
  }

  const tableColumnNames = ['Name', 'Keywords', 'Type', 'Size', 'Document Type', 'File']

  const returnTableData = () => {
    let tableData = []
    tableColumnNames.forEach((columnName, index) => {
      tableData.push({
        column_name: columnName,
        is_date: false,
        is_file: columnName == 'File' ? true : false,
        is_filterable: false,
        is_link: false,
        is_sortable: false,
        values: [],
      })
    })
    return tableData
  }
  const initialTableState = {
    columnsNum: 6,
    table_data: returnTableData(),
  }

  const [addComponentData, setAddComponentData] = useState(initialTableState)

  const components = [
    {
      title: 'Table',
      type: 'table',
    },
    { title: 'Link', type: 'link' },
    { title: 'Binary', type: 'binary' },
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
    API.post('/ryg_info/details/', {
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
    API.post('/ryg_info/page/update_table_data', formData)
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
      API.post('/ryg_info/page/link_component_to_sections', data)
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
    API.post('/ryg_info/page/list_sections', { is_archived: false })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          setSubProductList(res.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const bulkImageUpload = () => {
    setLoading(true)
    const formData = new FormData()
    const data = {
      type: 'image',
      section_id: productDetail[isAddComponentModalVisible].section_id,
    }
    formData.append('data', JSON.stringify(data))
    imagesToUpload.map((image, index) => {
      formData.append(`image${index + 1}`, image)
    })
    console.log(...formData)
    API.post('/ryg_info/page/add_bulk_image', formData)
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          res.data?.message && toast.success(res.data?.message)
          getProductDetails()
          setIsAddComponentModalVisible(-1)
          setAddComponentData(initialTableState)
          setImagesToUpload([])
          if (type === 'binary' || type === 'image') setInputBinary()
        }
      })
      .catch(error => {
        console.log(error)
      })
    setLoading(false)
  }

  const callAddComponentAPI = type => {
    setLoading(true)
    const payload = {
      type: type,
      section_id: productDetail[isAddComponentModalVisible].section_id,
      data: addComponentData,
    }
    // console.log(addComponentData)
    let data

    if (type === 'binary' || type === 'image') {
      data = new FormData()
      data.append('file', inputBinary)
      data.append('data', JSON.stringify(payload))
    } else {
      data = { data: JSON.stringify(payload) }
    }

    API.post('/ryg_info/page/add_component', data)
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          res.data?.message && toast.success(res.data?.message)
          getProductDetails()
          setIsAddComponentModalVisible(-1)
          setAddComponentData(initialTableState)
          if (type === 'binary' || type === 'image') setInputBinary()
        }
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  const onAddComponentCancel = () => {
    if (accordionRef.current) {
      Array.from(accordionRef.current.querySelectorAll('div.show')).forEach(el =>
        el.classList.remove('show')
      )
    }
    setAddComponentData(initialTableState)
    setInputBinary()
  }

  const onAddSection = () => {
    setLoading(true)
    API.post('/ryg_info/create_section', {
      page_id: state.page_id,
      section_name: sectionTitleRef.current.value,
      order_index: 1,
    })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          res.data?.message && toast.success(res.data?.message)
          getProductDetails()
          setIsAddSectionModalVisible(false)
          setLoading(false)
        }
      })
      .catch(error => {
        setIsAddSectionModalVisible(false)
        console.log(error)
        setLoading(false)
      })
  }

  const onComponentDelete = () => {
    setLoading(true)
    API.post('/ryg_info/page/delete_component', showDeleteModal)
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          res.data?.message && toast.success(res.data?.message)
          getProductDetails()
          setShowDeleteModal({})
        }
        setLoading(false)
      })
      .catch(error => {
        setShowDeleteModal({})
        console.log(error)
        setLoading(false)
      })
  }

  const updateRYGComponent = payload => {
    setLoading(true)
    let promises = []
    for (let index = 0; index < payload.length; index++) {
      promises.push(API.post('/ryg_info/page/update_component', payload[index]))
    }
    Promise.all(promises)
      .then(res => {
        if (res[0].status === 200 && res[0].data !== undefined) {
          res[0].data?.message && toast.success(res[0].data?.message)
          getProductDetails()
        }
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        getProductDetails()
        setLoading(false)
      })
  }

  const getNextId = () => {
    for (let i = 0; i < productDetail.length; i++) {
      const components = productDetail[i].components
      for (let j = 0; j < components.length; j++) {
        const tables = components[j]
        if (tables.id == tableId) {
          return tables.next_id
        }
      }
    }
  }

  const handleFileUpload = file => {
    const reader = new FileReader()

    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, readOpts)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, jsonOpts)

        setLoading(true)
        const ni = getNextId()
        const modifiedData = jsonData.map((row, index) => ({
          row_id: ni + index,
          data: Object.entries(row).map(([column_name, values]) => {
            console.log(column_name, values)
            return {
              column_name,
              values,
            }
          }),
        }))

        setExtractedData(modifiedData)
      } catch (error) {
        toast.error(`In valid Data: ${error}`)
      }
      setLoading(false)
    }

    reader.readAsArrayBuffer(file)
  }

  const onFileUpload = () => {
    const file = sectionFileRef.current.files[0]
    if (file) {
      // Check if the file is an Excel file
      const isExcelFile = file.name.endsWith('.xls') || file.name.endsWith('.xlsx')

      if (isExcelFile) {
        handleFileUpload(file)
        setUploadModalVisible(false)
        toast.success('File is being processed')
      } else {
        toast.error('Please upload an Excel file')
      }
    } else {
      toast.error('Please choose a file to upload')
    }
  }

  const renderType = (ele, idx, arr, section) => {
    if (ele.type === 'flow_Configurator_component') {
      return (
        <RYGFlowComponent
          data={ele}
          isAdmin={isAdmin}
          onUpdate={data => {
            updateRYGComponent(data)
          }}
        />
      )
    } else if (ele.type === 'binary') {
      return (
        <div className="col-12 mt-4">
          {(getUserRoles() == 'PMK Administrator' ||
            getUserRoles() == 'PMK Content Manager' ||
            getUserRoles() == 'Technical Administrator') && (
            <div className="row">
              <div className="ms-auto w-auto my-2 p-0 d-none d-lg-block">
                <Tooltip title="Link Component">
                  <Image
                    className="me-2"
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
                </Tooltip>
                <Tooltip title="Delete">
                  <i
                    role={'button'}
                    className="fa-solid fa-trash ms-2 me-0"
                    onClick={() => {
                      let payload = {
                        section_id: section.section_id,
                        component_id: ele.id,
                        component_type: ele.type,
                      }
                      setShowDeleteModal(payload)
                    }}
                  ></i>
                </Tooltip>
              </div>
            </div>
          )}
          <div className="row">
            {/* <span className="flex-fill">{ele.title}</span> */}
            <a
              className="bordered-btn rounded w-auto"
              role={'button'}
              href={ele.binary_link + `?token=${getToken()}`}
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
          isRYG={true}
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
          onUploadClick={() => {
            settableId(ele.id)
            setUploadModalVisible(true)
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
          handleFileUpload={handleFileUpload}
          extractedData={extractedData}
          tableId={tableId}
          setExtractedData={setExtractedData}
          editableBulk={editableBulk}
        />
      )
    } else if (ele.type === 'link') {
      return (
        <div className="col-12 mt-4">
          {(getUserRoles() == 'PMK Administrator' ||
            getUserRoles() == 'PMK Content Manager' ||
            getUserRoles() == 'Technical Administrator') && (
            <div className="row">
              <div className="ms-auto w-auto my-2 p-0 d-none d-lg-block">
                <Image
                  className="me-2"
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
                <Tooltip title="Delete">
                  <i
                    role={'button'}
                    className="fa-solid fa-trash ms-2 me-0"
                    onClick={() => {
                      let payload = {
                        section_id: section.section_id,
                        component_id: ele.id,
                        component_type: ele.type,
                      }
                      setShowDeleteModal(payload)
                    }}
                  ></i>
                </Tooltip>
              </div>
            </div>
          )}
          <div className="row">
            {/* <span className="flex-fill">{ele.title}</span> */}
            <a
              role={'button'}
              href={ele.link + `?token=${getToken()}`}
              target="_blank"
              className="w-auto p-0 theme"
            >
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
            getUserRoles() == 'Technical Administrator') && (
            <div className="row">
              <div className="ms-auto w-auto my-2 p-0 d-none d-lg-block">
                <Image
                  className="me-2"
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
                <Tooltip title="Delete">
                  <i
                    role={'button'}
                    className="fa-solid fa-trash ms-2 me-0"
                    onClick={() => {
                      let payload = {
                        section_id: section.section_id,
                        component_id: ele.id,
                        component_type: ele.type,
                      }
                      setShowDeleteModal(payload)
                    }}
                  ></i>
                </Tooltip>
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
              <div
                className={`col-6 col-lg-2 mt-2`}
                // NOTE: THE BELOW COMMENTED LINES OF CODE WAS USED IN THE CLASSNAME ABOVE. THEY HAVE BEEN COMMENTED BECAUSE THEY WERE CAUSING SIZE ISSUES.
                // ${
                //   !isMd
                //     ? IMAGES.length % 2 === 0
                //       ? ' ps-0'
                //       : ' pe-0'
                //     : IMAGES.length % 6 === 0
                //     ? ' ps-0'
                //     : IMAGES.length % 6 === 5
                //     ? ' pe-0'
                //     : ''
                // }
              >
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    //border: '1px solid black',
                    borderRadius: '0.25 rem',
                    boxShadow: '0 0 0.313rem #00000035',
                    padding: '0.5rem',
                  }}
                >
                  {isImageGridEditable.includes(idx) && (
                    <Tooltip title="Delete Image">
                      <i
                        className="fa-solid fa-xmark"
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '-10px',
                          float: 'right',
                          padding: '0.188rem 0.313rem',
                          borderRadius: '50%',
                          background: '#cd0000',
                          color: '#fff',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          let payload = {
                            section_id: section.section_id,
                            component_id: element.id,
                            component_type: element.type,
                          }
                          setShowDeleteModal(payload)
                        }}
                      ></i>
                    </Tooltip>
                  )}
                  <Image
                    src={element.image_link + `?token=${getToken()}`}
                    className="border rounded img-product-line"
                  />
                  <Tooltip title={element.image_name}>
                    <a
                      href={element.full_size_image_link + `?token=${getToken()}`}
                      target="_blank"
                      role={'button'}
                      className="col register-link"
                      style={{ textAlign: 'center', fontSize: 'small', padding: '0.25rem 0' }}
                      download
                    >
                      {element.image_name.length > 20
                        ? element.image_name.substring(0, 17) + '...'
                        : element.image_name}
                    </a>
                  </Tooltip>
                </div>
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
              getUserRoles() == 'Technical Administrator') && (
              <div className="row">
                <div className="ms-auto w-auto my-2 p-0 d-none d-lg-block">
                  <Tooltip title="Link Component">
                    <Image
                      className="me-2"
                      style={{ width: '1.4rem' }}
                      src={ic_link}
                      onClick={() => {
                        setIsSubProductsModalVisible(true)
                        setComponentToLink({
                          component_id: ele.id,
                          component_type: ele.type,
                        })
                      }}
                    />
                  </Tooltip>
                  <Tooltip title={!isImageGridEditable.includes(idx) ? 'Edit Image Grid' : 'Save'}>
                    <i
                      role={'button'}
                      className={
                        !isImageGridEditable.includes(idx)
                          ? 'fa-solid fa-pen-to-square me-2 theme'
                          : 'fa-solid fa-floppy-disk theme'
                      }
                      onClick={() => {
                        !isImageGridEditable.includes(idx)
                          ? setIsImageGridEditable(prevState => [...prevState, idx])
                          : setIsImageGridEditable(prevState =>
                              prevState.filter(item => item !== idx)
                            )
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Delete Image Grid">
                    <i
                      role={'button'}
                      className="fa-solid fa-trash ms-2 me-0"
                      onClick={() => {
                        let payload = {
                          section_id: section.section_id,
                          component_id: ele.id,
                          component_type: ele.type,
                        }
                        setShowDeleteModal(payload)
                      }}
                    ></i>
                  </Tooltip>
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
          <div
            className={`col-6 col-lg-2 mt-2`}
            // NOTE: THE BELOW COMMENTED LINES OF CODE WAS USED IN THE CLASSNAME ABOVE. THEY HAVE BEEN COMMENTED BECAUSE THEY WERE CAUSING SIZE ISSUES.
            // ${
            //   !isMd
            //     ? IMAGES.length % 2 === 0
            //       ? ' ps-0'
            //       : ' pe-0'
            //     : IMAGES.length % 6 === 0
            //     ? ' ps-0'
            //     : IMAGES.length % 6 === 5
            //     ? ' pe-0'
            //     : ''
            // }
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                //border: '1px solid black',
                borderRadius: '0.25 rem',
                boxShadow: '0 0 0.313rem #00000035',
                padding: '0.5rem',
              }}
            >
              {isImageGridEditable.includes(idx) && (
                <i
                  className="fa-solid fa-xmark"
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    float: 'right',
                    padding: '0.188rem 0.313rem',
                    borderRadius: '50%',
                    background: '#cd0000',
                    color: '#fff',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    let payload = {
                      section_id: section.section_id,
                      component_id: element.id,
                      component_type: element.type,
                    }
                    setShowDeleteModal(payload)
                  }}
                ></i>
              )}
              <Image
                src={element.image_link + `?token=${getToken()}`}
                className="border rounded img-product-line"
              />
              <Tooltip title={element.image_name}>
                <a
                  href={element.image_link + `?token=${getToken()}`}
                  target="_blank"
                  role={'button'}
                  className="col register-link"
                  style={{ textAlign: 'center', fontSize: 'small', padding: '0.25rem 0' }}
                  download
                >
                  {element.image_name.length > 20
                    ? element.image_name.substring(0, 17) + '...'
                    : element.image_name}
                </a>
              </Tooltip>
            </div>
          </div>
        )
      }
      return (
        <div className="col-12 mt-4">
          {(getUserRoles() == 'PMK Administrator' ||
            getUserRoles() == 'PMK Content Manager' ||
            getUserRoles() == 'Technical Administrator') && (
            <div className="row">
              <div className="ms-auto w-auto my-2 p-0 d-none d-lg-block">
                <Image
                  className="me-2"
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
                <Tooltip title={!isImageGridEditable.includes(idx) ? 'Edit Image Grid' : 'Save'}>
                  <i
                    role={'button'}
                    className={
                      !isImageGridEditable.includes(idx)
                        ? 'fa-solid fa-pen-to-square me-2 theme'
                        : 'fa-solid fa-floppy-disk theme'
                    }
                    onClick={() => {
                      !isImageGridEditable.includes(idx)
                        ? setIsImageGridEditable(prevState => [...prevState, idx])
                        : setIsImageGridEditable(prevState =>
                            prevState.filter(item => item !== idx)
                          )
                    }}
                  />
                </Tooltip>
                <Tooltip title="Delete Image Grid">
                  <i
                    role={'button'}
                    className="fa-solid fa-trash ms-2 me-0"
                    onClick={() => {
                      let payload = {
                        section_id: section.section_id,
                        component_id: ele.images[ele.images.length - 1].id,
                        component_type: 'image',
                      }
                      setShowDeleteModal(payload)
                    }}
                  ></i>
                </Tooltip>
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
      <div className="col-12 mt-3 mt-lg-5">
        <div className="row">
          <span
            className="text-bold p-0"
            style={{ fontSize: '1.5rem', color: '#004F9B', fontWeight: 'bolder' }}
          >
            {item.sectionName}
          </span>
        </div>
        <div className="row">
          {/* {console.log(item.components)} */}
          {item.components.map((ele, idx, arr) => renderType(ele, idx, arr, item))}
        </div>
        {(getUserRoles() == 'PMK Administrator' ||
          getUserRoles() == 'PMK Content Manager' ||
          getUserRoles() == 'Technical Administrator') && (
          <div className="row mt-3 d-none d-lg-block">
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

  const handleTableDataChange = (e, item, i) => {
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
            value={addComponentData.columnsNum}
            onChange={e => {
              // if (parseInt(e.target.value) <= 10)
              if (e.target.value >= 6) {
                let newTable = []
                for (let k = 0; k < parseInt(e.target.value); k++) {
                  newTable.push(addComponentData.table_data[k])
                }
                setAddComponentData(prevState => {
                  return {
                    ...prevState,
                    columnsNum: parseInt(e.target.value),
                    table_data: newTable,
                  }
                })
              } else {
                setAddComponentData(prevState => {
                  return {
                    ...prevState,
                    columnsNum: parseInt(e.target.value),
                  }
                })
              }
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
            {addComponentData?.columnsNum >= 6 ? (
              [...Array(addComponentData?.columnsNum)].map((e, i) => {
                return (
                  <div className="row add-table-row d-flex align-items-center">
                    {columneNames.map((item, index) =>
                      index === 0 ? (
                        <input
                          disabled={tableColumnNames.includes(
                            addComponentData?.table_data[i]?.column_name
                          )}
                          value={addComponentData?.table_data[i]?.column_name || ''}
                          style={{ textTransform: 'capitalize' }}
                          className={`${
                            index === 0 ? 'col-4 add-table-col-input' : 'col add-table-col-input'
                          }`}
                          placeholder="column name"
                          onChange={e => {
                            handleTableDataChange(e, item, i)
                          }}
                        />
                      ) : (
                        <input
                          disabled={
                            item.title == 'File' ||
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
                          checked={addComponentData?.table_data[i]?.[item.key]}
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
                )
              })
            ) : (
              <p>Minimum 6 Columns required</p>
            )}
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
            className="btn me-2"
          >
            Cancel
          </button>
          <button
            disabled={
              // addComponentData?.table_name === undefined ||
              // addComponentData?.table_name === '' ||
              addComponentData?.columnsNum === undefined
            }
            className="btn btn-primary ms-2"
            onClick={() => {
              if (addComponentData.columnsNum < 6) toast.error('Minimum 6 columns are required')
              else callAddComponentAPI('table')
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
            className="btn me-2"
          >
            Cancel
          </button>
          <button
            disabled={addComponentData?.title === undefined || addComponentData?.link === undefined}
            className="btn btn-primary ms-2"
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
            className="btn me-2"
          >
            Cancel
          </button>
          <button
            disabled={
              addComponentData?.title === undefined ||
              inputBinary === undefined ||
              inputBinary === null
            }
            className="btn btn-primary ms-2"
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
            className="btn me-2"
          >
            Cancel
          </button>
          <button
            disabled={addComponentData?.description === undefined}
            className="btn btn-primary ms-2"
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
        {/* <div className="input-group mb-3">
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
        </div> */}
        <div className="input-group mb-3">
          <div className="custom-file">
            <input
              onChange={e => {
                let images = []
                for (let i = 0; i < e.target.files.length; i++) {
                  images.push(e.target.files[i])
                }
                setImagesToUpload(prevState => {
                  return [...prevState, ...images]
                })
              }}
              type="file"
              className="custom-file-input"
              id="inputGroupFile03"
              aria-describedby="inputGroupFileAddon03"
              accept="image/*"
              multiple
            />
            <label className="custom-file-label font-8 font-weight-bold" htmlFor="inputGroupFile03">
              {inputBinary?.name ? inputBinary?.name : 'Select files'}
            </label>
          </div>
        </div>
        {imagesToUpload.length !== 0
          ? imagesToUpload.map((image, index) => {
              return (
                <div
                  style={{
                    paddingRight: 'calc(var(--bs-gutter-x) * 0.5)',
                    paddingLeft: 'calc(var(--bs-gutter-x) * 0.5)',
                    marginBottom: '0.5rem',
                  }}
                >
                  <div
                    key={index}
                    className=""
                    style={{
                      border: '1px solid lightgrey',
                      fontSize: 'small',
                      width: '100%',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {image.name}
                    <i
                      className="fa-solid fa-xmark"
                      onClick={() => {
                        setImagesToUpload(imagesToUpload.filter(img => img !== image))
                      }}
                    ></i>
                  </div>
                </div>
              )
            })
          : null}
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
            className="btn me-2"
          >
            Cancel
          </button>
          <button
            disabled={
              // addComponentData?.title === undefined ||
              //inputBinary === undefined || inputBinary === null
              imagesToUpload.length === 0
            }
            className="btn btn-primary ms-2"
            onClick={() => {
              //callAddComponentAPI('image')
              bulkImageUpload()
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

  React.useLayoutEffect(() => {
    updateWindowDimensions()
    window.addEventListener('resize', updateWindowDimensions)
    return () => window.removeEventListener('resize', updateWindowDimensions)
  }, [])

  useEffect(() => {
    getProductDetails()
    ;(getUserRoles() == 'PMK Administrator' ||
      getUserRoles() == 'PMK Content Manager' ||
      getUserRoles() == 'Technical Administrator') &&
      getSubProductsList()
  }, [state])

  return (
    <>
      <Header
        isLogedIn={getToken()}
        isAdmin={
          getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'
        }
      />
      <div className="row mx-2 mx-lg-5 h-100 gray-table">
        <div className="col center py-3">
          <div className="row d-none d-lg-block">
            <div className="col-12 col-lg-5 border rounded py-2">
              <div className="row">
                {/* <span role="button" className="col-4 light-grey">
                  <Link to={'/ryg-information'}>Previous page</Link>
                </span> */}
                <span
                  role="button"
                  className="col-4 light-grey"
                  onClick={() => {
                    navigate(-1)
                  }}
                >
                  Previous page
                </span>
                <span
                  className="col-8"
                  // style={{
                  //   wordBreak: 'break-all',
                  // }}
                >
                  <Link to={'/ryg-information'}>RYG Information</Link>
                  {'>'} {state.page_title}
                </span>
              </div>
            </div>
          </div>
          <>
            <div className="row">{renderComponents()}</div>
            {(getUserRoles() == 'PMK Administrator' ||
              getUserRoles() == 'PMK Content Manager' ||
              getUserRoles() == 'Technical Administrator') && (
              <div className="mt-2 justify-content-center d-none d-lg-flex">
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
          <button id="mybtn" className="btn btn-background me-4" onClick={() => {}}>
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
              className="btn me-2"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary ms-2"
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
        <Modal.Body className="p-4 text-center pt-0">
          <div className="mb-3">
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
              className="btn me-2"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary ms-2"
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
            {Array.isArray(subProductList) &&
              subProductList.map((productList, idx) => {
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
                        <span>{htmlParser(productList.name)}</span>
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
                          <div className="py-1 px-3 d-flex align-items-center">
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
                              className="form-check-input my-0"
                              type="checkbox"
                              value=""
                              id="flexCheckDefault"
                            />
                            <label
                              className="form-check-label clamp-1v ps-1"
                              for="flexCheckDefault"
                              style={{ fontSize: '1.5rem', color: '#004F9B', fontWeight: 'bolder' }}
                            >
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
            className="btn btn-background me-4"
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
      <Modal
        show={isUploadModalVisible}
        centered
        onHide={() => {
          setUploadModalVisible(false)
          setEditableBulk(false)
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
          <Modal.Title>Upload a File</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="mb-5">
            <input
              ref={sectionFileRef}
              placeholder="Choose a file to upload"
              type="file"
              className="form-control w-100"
              aria-label={'File'}
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
                setUploadModalVisible(false)
                setEditableBulk(false)
              }}
              className="btn me-2"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary ms-2"
              onClick={() => {
                onFileUpload()
              }}
            >
              Confirm
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default RYGDetail
