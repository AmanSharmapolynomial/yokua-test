import React, { useEffect, useState } from 'react'
import API from '../../../utils/api'
import './Tokuchu.css'
import TokochuTable from '../../../components/TableComponent/TokochuTable'
import PrimaryHeading from '../../../components/Primary Headings'
import { toast } from 'react-toastify'
import DeleteModal from '../../../components/Modals/Delete Modal/DeleteModal'
import { FormControl, Modal } from 'react-bootstrap'

const EDIT_PRODUCT = 'Product'
const EDIT_SUB_PRODUCT = 'Sub Product'
const EDIT_SUB_PRODUCT_ITEM = 'Sub Product Item'

export default () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentEdit, setCurrentEdit] = useState('')
  const [parentId, setParentId] = useState(0)

  const [needToReload, setNeedToReload] = useState(true)

  const [isArchived, setIsArchived] = useState(false)
  const [products, setProducts] = useState([])
  const [tableDetails, setTableDetails] = useState(null)
  const [pageDetails, setPageDetails] = useState([])

  const [subProductLoading, setSubProductLoading] = useState(false)
  const [productItemLoading, setProductItemLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState()
  const [dataToShow, setDataToShow] = useState()

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

  const _getDetails = (productItemId = 1) => {
    API.post('tokuchu/details/', {
      page_id: productItemId,
    })
      .then(data => {
        if (data.data.length < 1) {
          setPageDetails({})
          setTableDetails({})
        } else {
          setPageDetails(data.data)
          setTableDetails(data.data[0].components[0])
        }
      })
      .catch(err => {})
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
          toast.success('Component Deleted Successfully')
          selectedProduct?.id !== undefined && _getDetails(selectedProduct.id)
        })
        .catch(err => {})
    } else {
      toast.error('Can not delete empty table')
    }
  }

  const _createSection = (pageId, sectionName, orderIndex = 1) => {
    API.post('tokuchu/create_section', {
      page_id: pageId,
      section_name: sectionName,
      order_index: orderIndex,
    })
      .then(data => {
        toast.success('Section created Successfully')
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
        toast.success('Archieved Successfully')
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
        toast.success('Product added Successfully')
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
        toast.success('Sub Product added Successfully')
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
        toast.success('Sub Product Item added Successfully')
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
        toast.success('New row added Successfully')
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
                                _getProductItems(sub.id, item.id)
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
                                  <i className="fa fa-chevron-right mt-1" aria-hidden="true" />
                                </a>
                                <ul
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
                                </ul>
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
                        // e.stopPropagation()
                        setDataToShow({ ...dataToShow, level: 2, subIdx: i, name: sub.name })
                        _getProductItems(sub.id, dataToShow.id)
                      }}
                    >
                      {sub.name}
                      <i className="fa fa-chevron-right mt-1" aria-hidden="true" />
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
            {tableDetails && (
              <TokochuTable
                tableObject={tableDetails}
                setShowDeleteModal={setShowDeleteModal}
                onRefresh={() => {
                  selectedProduct?.id !== undefined && _getDetails(selectedProduct.id)
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

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
              toast.error('Please enter valid Name')
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
