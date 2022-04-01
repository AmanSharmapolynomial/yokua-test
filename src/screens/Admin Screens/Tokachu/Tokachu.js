import React, { useEffect, useState } from 'react'
import API from '../../../utils/api'
import './Tokachu.css'
import Table from '../../../components/TableComponent/Table'
import PrimaryHeading from '../../../components/Primary Headings'
import { toast } from 'react-toastify'
import DeleteModal from '../../../components/Modals/Delete Modal/DeleteModal'
import { FormControl, Modal } from 'react-bootstrap'

const EDIT_PRODUCT = 'Product'
const EDIT_SUB_PRODUCT = 'Sub Product'
const EDIT_SUB_PRODUCT_ITEM = 'Sub Product Item'

export default () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentDeleteId, setCurrentDeleteId] = useState(0)

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
    const updatedProducts = products
    const currentProduct = updatedProducts.find(item => item.id === productId)
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
    const updatedProducts = products
    const currentProduct = updatedProducts.find(item => item.id === productId)
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

  const _getDetails = (productItemId = 5) => {
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
    const sectionId = tableDetails?.id
    const componentId = pageDetails[0]?.id
    if (sectionId && componentId) {
      API.post('tokuchu/page/delete_component', {
        section_id: sectionId,
        component_id: componentId,
      })
        .then(data => {
          toast.success('Component Deleted Successfully')
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
    if (currentEdit == EDIT_PRODUCT) {
      _addProduct(name)
    } else if (currentEdit == EDIT_SUB_PRODUCT) {
      _addSubProduct(name, parentId)
    } else if (currentEdit == EDIT_SUB_PRODUCT_ITEM) {
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

  const _updateTableData = (image, data = {}, columnName = [], tableId, actionType = 'add_row') => {
    const formData = new FormData()
    if (image) {
      formData.append('file', image)
    }
    const payload = {
      table_id: tableId,
      action_type: actionType,
    }

    formData.append('data', payload)
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
      if (item.id == productId) {
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
    const currentProduct = products.find(item => item.id == productId)

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
        key={'Tokachu Delete'}
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
      <div className="tokachu-main row mx-5 h-100">
        <div className="profile-setting-container col center md-3">
          <PrimaryHeading title={'Approved Tokachu'} backgroundImage={'yk-back-image-news'} />
          <div className="container">
            <div className="toku-dropdn">
              <div className="row">
                <div className="dropdown p-0">
                  <div className="btn-group">
                    <button
                      className="btn btn-secondary btn-main btn-sm"
                      type="button"
                      data-toggle="dropdown"
                    >
                      Choose your Product line
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary btn-arrow dropdown-toggle dropdown-toggle-split"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
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
                          <a className="dropdown-item" tabIndex="-1">
                            {item.name}{' '}
                            <i className="fa fa-chevron-right mt-1" aria-hidden="true"></i>
                          </a>
                          <ul className="dropdown-menu">
                            {subProductLoading && (
                              <li className="dropdown-submenu">
                                <li className="dropdown-submenu">
                                  <a className="dropdown-item">Please wait Fetching ..</a>
                                </li>
                              </li>
                            )}

                            {item.subProducts.length > 0 &&
                              item.subProducts.map((sub, i) => (
                                <li
                                  className="dropdown-submenu"
                                  key={i}
                                  onMouseEnter={() => {
                                    _getProductItems(sub.id, item.id)
                                  }}
                                >
                                  <li className="dropdown-submenu">
                                    <a className="dropdown-item">
                                      {sub.name}
                                      <i
                                        className="fa fa-chevron-right mt-1"
                                        aria-hidden="true"
                                      ></i>
                                    </a>
                                    <ul className="dropdown-menu">
                                      {productItemLoading && (
                                        <li className="dropdown-item" key={'Sub Fetching'}>
                                          <a>Please wait Fetching</a>
                                        </li>
                                      )}
                                      {sub.productItems.map(prod => (
                                        <li
                                          className="dropdown-item"
                                          key={prod.name}
                                          onClick={() => _getDetails(prod.id)}
                                        >
                                          <a>{prod.name}</a>
                                        </li>
                                      ))}

                                      <div className="col d-flex justify-content-center">
                                        <button
                                          className="btn yg-font-size"
                                          onClick={() => {
                                            setParentId(sub.id)
                                            setCurrentEdit(EDIT_SUB_PRODUCT_ITEM)
                                            setShowAddModal(true)
                                          }}
                                        >
                                          Add
                                        </button>
                                      </div>
                                    </ul>
                                  </li>
                                </li>
                              ))}

                            <div className="col d-flex justify-content-center">
                              <button
                                className="btn yg-font-size"
                                onClick={() => {
                                  setParentId(item.id)
                                  setCurrentEdit(EDIT_SUB_PRODUCT)
                                  setShowAddModal(true)
                                }}
                              >
                                Add
                              </button>
                            </div>
                          </ul>
                        </li>
                      ))}

                      <div className="col d-flex justify-content-center">
                        <button
                          className="btn yg-font-size"
                          onClick={() => {
                            setCurrentEdit(EDIT_PRODUCT)
                            setShowAddModal(true)
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {tableDetails && (
            <Table tableObject={tableDetails} setShowDeleteModal={setShowDeleteModal} />
          )}
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
          className="btn btn-background mr-4"
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
