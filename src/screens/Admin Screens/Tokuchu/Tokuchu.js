import React, { useEffect, useState } from 'react'
import API from '../../../utils/api'
import './Tokuchu.css'
import TokochuTable from '../../../components/TableComponent/TokochuTable'
import PrimaryHeading from '../../../components/Primary Headings'
import { toast } from 'react-toastify'
import DeleteModal from '../../../components/Modals/Delete Modal/DeleteModal'
import { FormControl, Modal } from 'react-bootstrap'
import * as XLSX from 'xlsx'
import { useLoading } from '../../../utils/LoadingContext'

const EDIT_PRODUCT = 'Product'
const EDIT_SUB_PRODUCT = 'Sub Product'
const EDIT_SUB_PRODUCT_ITEM = 'Sub Product Item'

const checkIfColumnIsMissing = (data, tableHeader) => {
  if (data.length === 0) throw 'No Data found'
  const importedColumns = Object.keys(data[0]).sort()
  tableHeader.sort()

  for (let i = 0; i < tableHeader.length; i++) {
    if (tableHeader[i] != importedColumns[i]) {
      throw `${tableHeader[i]} missing`
    }
  }
}

function convertSerialDate(serialDate) {
  try {
    // console.log(serialDate)
    // const parts = serialDate.split(/\D+/);
    // const day = parseInt(parts[2], 10);
    // const month = parseInt(parts[1], 10) - 1;
    // const year = parseInt(parts[0], 10);
    // const date = new Date(year, month, day).toISOString().slice(0, 10);
    // console.log(date)
    return serialDate.toISOString().slice(0, 10)
    // const excelEpoch = new Date(1899, 11, 30) //adjusted to account for the leap year error in excel
    // const millisecondsPerDay = 24 * 60 * 60 * 1000
    // const dateObject = new Date(excelEpoch.getTime() + serialDate * millisecondsPerDay)
    // return dateObject.toISOString().slice(0, 10)
  } catch (error) {
    console.log(error)
    return ''
  }
}
const Tokuchu = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentEdit, setCurrentEdit] = useState('')
  const [parentId, setParentId] = useState(0)
  const { setLoading } = useLoading()

  const sectionFileRef = React.useRef(null)
  const [needToReload, setNeedToReload] = useState(true)

  const [isArchived, setIsArchived] = useState(false)
  const [products, setProducts] = useState([])
  const [tableDetails, setTableDetails] = useState(null)
  const [tableData, setTableData] = useState([])
  const [pageDetails, setPageDetails] = useState([])

  const [subProductLoading, setSubProductLoading] = useState(false)
  const [productItemLoading, setProductItemLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState()
  const [dataToShow, setDataToShow] = useState()
  const [allRequest, setAllRequest] = useState(false)
  const [allTableData, setAllTableData] = useState({})
  const [tableId, settableId] = useState(null)
  const [extractedData, setExtractedData] = useState([])
  const tableRef = React.useRef(null)

  const _getProducts = () => {
    API.post('tokuchu/list_view', {
      is_archived: isArchived,
    })
      .then(data => {
        const updated = createEmptySubProducts(data.data)
        setProducts(updated)
      })
      .catch(err => console.log(err))
  }

  const _getSubProducts = (productId = 1) => {
    const currentProduct = products.find(item => item.id === productId)
    if (!subProductLoading && currentProduct.subProducts.length < 1) {
      setSubProductLoading(true)
      API.post('tokuchu/list_view/sub_products/', {
        product_id: productId,
        is_archived: isArchived,
      })
        .then(data => {
          setSubProductLoading(false)
          assignSubProducts(data.data, productId)
        })
        .catch(err => {
          setSubProductLoading(false)
        })
    }
  }

  const _getProductItems = (subProductId = 1, productId) => {
    const currentProduct = products.find(item => item.id === productId)
    const currentItem = currentProduct.subProducts.find(item => item.id === subProductId)
    if (!productItemLoading && currentItem.productItems.length < 1) {
      setProductItemLoading(true)
      API.post('tokuchu/list_view/sub_products_item/', {
        sub_product_id: subProductId,
        is_archived: isArchived,
      })
        .then(data => {
          assignProductItems(data.data, productId, subProductId)
          setProductItemLoading(false)
        })
        .catch(err => {
          setProductItemLoading(false)
        })
    }
  }

  const _getDetails = async (productItemId = 1) => {
    setAllRequest(false)
    setAllTableData({})
    setTableData([])
    const res = await API.post('tokuchu/details/', {
      page_id: productItemId,
    })
    if (res.data.length < 1) {
      setPageDetails({})
      setTableDetails({})
      setTableData([])
    }
    // // FOR ALL PRODUCTS REQUEST
    else if (selectedProduct.name.toLowerCase().includes('all')) {
      setAllRequest(true)
      let allData = res.data[0].components[0]
      for (let i = 1; i < res.data.length; i++) {
        res.data[i].components[0].table_data.map(column => {
          allData.table_data
            .find(item => item.column_name === column.column_name)
            .values.push(...column.values)
        })
      }
      setAllTableData(allData)
    } else {
      setPageDetails(res.data)
      setTableData(res.data)
      setTableDetails(res.data[0].components[0])
    }
  }

  const _deleteComponent = () => {
    const sectionId = pageDetails[0]?.section_id
    const componentId = tableDetails?.id
    if (sectionId && componentId) {
      API.post('tokuchu/page/delete_component', {
        section_id: sectionId,
        component_id: componentId,
      })
        .then(data => {
          toast.success('Component deleted successfully')
          selectedProduct?.id !== undefined && _getDetails(selectedProduct.id)
        })
        .catch(err => {})
    } else {
      toast.error('Can not delete an empty table')
    }
  }

  const _createSection = (pageId, sectionName, orderIndex = 1) => {
    API.post('tokuchu/create_section', {
      page_id: pageId,
      section_name: sectionName,
      order_index: orderIndex,
    })
      .then(data => {
        toast.success('Section created successfully')
      })
      .catch(err => {})
  }

  /**
   *
   * @param archieveType : ['sub product', 'product', 'sub product item', 'page', 'section', 'component']
   * @param id
   * @private
   */
  const _setArchive = (archieveType, id) => {
    API.post('tokuchu/set_archive', {
      archive_type: archieveType,
      id: id,
    })
      .then(data => {
        toast.success('Successfully archived')
      })
      .catch(err => {})
  }

  const _addNewItem = (currentEdit, parentId, name) => {
    if (currentEdit === EDIT_PRODUCT) {
      _addProduct(name)
    } else if (currentEdit === EDIT_SUB_PRODUCT) {
      _addSubProduct(name, parentId)
    } else if (currentEdit === EDIT_SUB_PRODUCT_ITEM) {
      _addSubProductItem(name, parentId)
    } else {
      console.log('NO SUCH TYPE OF PRODUCT')
    }
  }

  const _addProduct = name => {
    API.post('tokuchu/add_product', {
      product_name: [name],
    })
      .then(data => {
        setNeedToReload(!needToReload)
        toast.success('Product added successfully')
      })
      .catch(err => {})
  }

  const _addSubProduct = (name, productId) => {
    API.post('tokuchu/add_sub_product', {
      sub_product_name: [name],
      product_id: productId,
    })
      .then(data => {
        setNeedToReload(!needToReload)
        toast.success('Sub-product added successfully')
      })
      .catch(err => {})
  }

  const _addSubProductItem = (name, subProductId) => {
    API.post('tokuchu/add_sub_product_item', {
      sub_product_item_name: [name],
      sub_product_id: subProductId,
    })
      .then(data => {
        setNeedToReload(!needToReload)
        toast.success('Sub-product item added successfully')
      })
      .catch(err => {})
  }

  const _updateTableData = (image, data = {}, tableId, actionType = 'add_row') => {
    const formData = new FormData()
    if (image) {
      formData.append('file', image)
    }
    const payload = {
      table_id: tableId,
      action_type: actionType,
      data: data,
    }

    formData.append('data', JSON.stringify(payload))
    API.post('tokuchu/page/update_table_data', formData)
      .then(data => {
        toast.success('New row added successfully')
      })
      .catch(err => {})
  }

  const createEmptySubProducts = (p = []) => {
    const temp = p
    temp.forEach((item, index) => {
      item.subProducts = []
    })
    return temp
  }

  // File Upload and Parsing Logic

  const handleFileUpload = file => {
    const reader = new FileReader()

    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array', cellDates: true })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 2 })

        setLoading(true)
        // if(jsonData.length < 8) {
        //   throw "Column is mssing"
        // }
        const tableHeader = tableData[0].components[0].table_data
          .filter(({ column_name }) => column_name != 'Tokuchu')
          .map(({ column_name }) => column_name)
        checkIfColumnIsMissing(jsonData, tableHeader)
        const modifiedData = jsonData.map((row, index) => ({
          row_id: tableData[0].components[0].next_id + index,
          data: Object.entries(row).map(([column_name, values]) => ({
            column_name,
            values: column_name === 'Valid Until' ? convertSerialDate(values) : values,
          })),
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
        setShowUploadModal(false)
        toast.success('File is being processed')
      } else {
        toast.error('Please upload an Excel file')
      }
    } else {
      toast.error('Please choose a file to upload')
    }
  }

  // File Upload and Parsing Logic Ends

  const assignSubProducts = (data, productId) => {
    const updatedProducts = products
    updatedProducts.forEach(item => {
      if (item.id === productId) {
        item.subProducts = createEmptyProductItems(data)
      }
    })
    setProducts([...updatedProducts])
  }

  const createEmptyProductItems = (p = []) => {
    const temp = p
    temp.forEach((item, index) => {
      item.productItems = []
    })
    return temp
  }

  const assignProductItems = (data, productId, subProductId) => {
    const updatedProducts = products
    const currentProduct = products.find(item => item.id === productId)

    currentProduct.subProducts.forEach(item => {
      if (item.id === subProductId) {
        item.productItems = data
      }
    })
    updatedProducts[updatedProducts.findIndex(i => i.id === productId)] = currentProduct

    setProducts([...updatedProducts])
  }

  useEffect(() => {
    _getProducts()
  }, [needToReload])

  return (
    <>
      <DeleteModal
        key={'Tokuchu Delete'}
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        data={''}
        req={'Table'}
        title={'Are you sure you want to delete this Table'}
        saveAndExit={() => setShowDeleteModal(false)}
        runDelete={id => _deleteComponent(id)}
      />

      <AddModal
        key={currentEdit}
        show={showAddModal}
        parentId={parentId}
        setShow={setShowAddModal}
        currentEdit={currentEdit}
        saveCompany={_addNewItem}
      />
      {/* New modal for uploading file */}
      <Modal
        show={showUploadModal}
        centered
        onHide={() => {
          showUploadModal(false)
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
                setShowUploadModal(false)
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
      {/* modal for file upload ends */}

      <div className="row mx-2 mx-lg-5" style={{ minHeight: '120vh' }}>
        <div className="col center py-3">
          <PrimaryHeading title={'Approved Tokuchus'} backgroundImage={'yk-back-tokuchu-news'} />
          <div className="toku-dropdn mt-4 d-none d-lg-block">
            <div className="dropdown p-0">
              <div className="btn-group">
                <button
                  style={{
                    width: '15.6rem',
                    fontWeight: '600',
                  }}
                  className="btn btn-secondary btn-main btn-sm"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                  data-display="static"
                  aria-hidden="true"
                  data-toggle="dropdown"
                >
                  {selectedProduct?.name ? selectedProduct.name : 'Choose your Product line'}
                </button>
                <button
                  aria-haspopup="true"
                  aria-expanded="false"
                  data-display="static"
                  aria-hidden="true"
                  data-toggle="dropdown"
                  type="button"
                  className="btn btn-sm btn-secondary btn-arrow dropdown-toggle dropdown-toggle-split"
                >
                  <span className="sr-only">Toggle Dropdown</span>
                </button>
                <ul
                  className="dropdown-menu multi-level"
                  role="menu"
                  aria-labelledby="dropdownMenu"
                >
                  {products.map((item, index) => (
                    <li
                      className="dropdown-submenu"
                      key={item.name}
                      onMouseEnter={() => {
                        _getSubProducts(item.id)
                      }}
                    >
                      <a
                        style={{
                          fontWeight: '600',
                        }}
                        className="dropdown-item"
                        tabIndex="-1"
                      >
                        {item.name} <i className="fa fa-chevron-right mt-1" aria-hidden="true" />
                      </a>
                      <ul
                        className="dropdown-menu"
                        // style={{ maxHeight: '16rem', overflowX: 'hidden', overflowY: 'scroll' }}
                      >
                        {subProductLoading ? (
                          <li className="dropdown-submenu">
                            <li className="dropdown-submenu">
                              <a className="dropdown-item">Please wait Fetching ..</a>
                            </li>
                          </li>
                        ) : item.subProducts.length > 0 ? (
                          item.subProducts.map((sub, i) => (
                            <li
                              className="dropdown-submenu"
                              key={i}
                              onMouseEnter={() => {
                                // _getProductItems(sub.id, item.id)
                                setSelectedProduct(sub)
                              }}
                            >
                              <li className="dropdown-submenu">
                                <a
                                  style={{
                                    fontWeight: '600',
                                  }}
                                  className="dropdown-item"
                                >
                                  {sub.name}
                                  {/* <i className="fa fa-chevron-right mt-1" aria-hidden="true" /> */}
                                </a>
                                {/* <ul
                                  className="dropdown-menu"
                                  style={{
                                    maxHeight: '16rem',
                                    overflowX: 'hidden',
                                    overflowY: 'scroll',
                                  }}
                                >
                                  {productItemLoading ? (
                                    <li className="dropdown-item" key={'Sub Fetching'}>
                                      <a>Please wait Fetching</a>
                                    </li>
                                  ) : sub.productItems.length > 0 ? (
                                    sub.productItems.map(prod => (
                                      <li
                                        className="dropdown-item"
                                        key={prod.name}
                                        onClick={e => {
                                          // e.stopPropagation()
                                          setSelectedProduct(prod)
                                        }}
                                      >
                                        <a
                                          style={{
                                            fontWeight: '600',
                                          }}
                                        >
                                          {prod.name}
                                        </a>
                                      </li>
                                    ))
                                  ) : (
                                    <li className="dropdown-item" key={'Sub Fetching'}>
                                      <a>No Data Found ..</a>
                                    </li>
                                  )}
                                </ul> */}
                              </li>
                            </li>
                          ))
                        ) : (
                          <li className="dropdown-submenu">
                            <li className="dropdown-submenu">
                              <a className="dropdown-item">No Data Found ..</a>
                            </li>
                          </li>
                        )}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="d-block d-lg-none border mx-5 mt-5 rounded px-1 py-1">
            <div className="dropdown row d-flex align-items-center">
              {dataToShow?.level !== undefined || dataToShow?.level >= 1 ? (
                <div
                  className="icon-container col-auto pe-0"
                  onClick={() => {
                    if (dataToShow?.level === 1) {
                      setSelectedProduct(undefined)
                      setDataToShow({ ...dataToShow, level: undefined, name: undefined })
                    } else {
                      setSelectedProduct(undefined)
                      setDataToShow({
                        ...dataToShow,
                        level: 1,
                        name: products[dataToShow?.idx].name,
                      })
                    }
                  }}
                >
                  <i className="fa-solid fa-angle-left" />
                </div>
              ) : null}
              <div
                className="col"
                href="#"
                role="button"
                id="dropdownMenuLink"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                <div>{dataToShow?.name ? dataToShow.name : 'Choose your Product line'}</div>
              </div>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                {dataToShow?.level === undefined || dataToShow?.level < 1 ? (
                  products.map((item, index) => (
                    <div
                      className="dropdown-item flex-fill"
                      href="#"
                      onClick={() => {
                        setDataToShow({ ...item, level: 1, idx: index })
                        _getSubProducts(item.id)
                      }}
                    >
                      {item.name}
                      <i className="fa fa-chevron-right mt-1" aria-hidden="true" />
                    </div>
                  ))
                ) : dataToShow?.level === 1 ? (
                  /*products[dataToShow?.idx]?.subProducts?.length > 0 ? (*/
                  products[dataToShow?.idx]?.subProducts.map((sub, i) => (
                    <div
                      className="dropdown-item"
                      key={sub.name}
                      onClick={e => {
                        setDataToShow({ ...dataToShow, name: sub.name })
                        setSelectedProduct(sub)
                      }}
                    >
                      {sub.name}
                    </div>
                    /*)*/
                  ))
                ) : dataToShow?.level === 2 ? (
                  products[dataToShow?.idx]?.subProducts[dataToShow?.subIdx]?.productItems.map(
                    prod => (
                      <li
                        className="dropdown-item"
                        key={prod.name}
                        onClick={e => {
                          // e.stopPropagation()
                          setDataToShow({ ...dataToShow, name: prod.name })
                          setSelectedProduct(prod)
                        }}
                      >
                        <a
                          style={{
                            fontWeight: '600',
                          }}
                        >
                          {prod.name}
                        </a>
                      </li>
                    )
                  )
                ) : (
                  <li className="dropdown-item" key={'Sub Fetching'}>
                    <a>No Data Found ..</a>
                  </li>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 d-flex">
            <button
              disabled={selectedProduct?.id === undefined}
              className={`btn create-domain-btn${
                selectedProduct?.id === undefined ? ' greyed' : ''
              } mx-auto mx-lg-0`}
              onClick={() => {
                selectedProduct?.id !== undefined && _getDetails(selectedProduct.id)
              }}
            >
              Load Results
            </button>
          </div>
          <div className="mt-5">
            {allRequest ? (
              <TokochuTable
                allRequest={allRequest}
                sectionName={'ALL'}
                tableObject={allTableData}
                setShowDeleteModal={setShowDeleteModal}
                setShowUploadModal={setShowUploadModal}
                onRefresh={() => {
                  selectedProduct?.id !== undefined && _getDetails(selectedProduct.id)
                }}
                handleFileUpload={handleFileUpload}
                extractedData={extractedData}
                tableId={tableId}
                setExtractedData={setExtractedData}
                settableId={settableId}
                ref={tableRef}
                rowName={rowName}
                setRowName={setRowName}
              />
            ) : (
              //{
              tableData &&
              tableData.map(tData => {
                return (
                  <TokochuTable
                    allRequest={allRequest}
                    sectionName={tData.sectionName}
                    tableObject={tData.components[0]}
                    setShowDeleteModal={setShowDeleteModal}
                    setShowUploadModal={setShowUploadModal}
                    onRefresh={() => {
                      selectedProduct?.id !== undefined && _getDetails(selectedProduct.id)
                    }}
                    handleFileUpload={handleFileUpload}
                    extractedData={extractedData}
                    tableId={tableId}
                    setExtractedData={setExtractedData}
                    settableId={settableId}
                    ref={tableRef}
                  />
                )
              })
              //}
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Tokuchu

const AddModal = ({ show, setShow, currentEdit, parentId, saveCompany }) => {
  const [name, setName] = useState('')
  const handleClose = () => setShow(false)

  return (
    <Modal show={show} centered onHide={handleClose}>
      <Modal.Header
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: '0',
        }}
      >
        <Modal.Title>Enter {currentEdit} Name</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          borderBottom: '0',
          fontWeight: 'normal',
        }}
      >
        <FormControl
          className="yg-font-size mt-4 mb-3"
          placeholder={'Enter Name'}
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          value={name}
          onChange={e => setName(e.target.value)}
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
            handleClose()
          }}
        >
          Cancel
        </button>
        <button
          className="btn"
          onClick={() => {
            if (name.length < 2) {
              toast.error('Please enter a valid name')
              return
            }
            saveCompany(currentEdit, parentId, name)
            setName('')
            handleClose()
          }}
        >
          Confirm
        </button>
      </Modal.Footer>
    </Modal>
  )
}
