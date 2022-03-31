import React, { useEffect, useState } from 'react'
import API from '../../../utils/api'
import './Tokachu.css'
import Table from '../../../components/TableComponent/Table'
import PrimaryHeading from '../../../components/Primary Headings'
import { toast } from 'react-toastify'

export default () => {
  const [isArchieved, setIsArchived] = useState(false)
  const [products, setProducts] = useState([])
  const [tableDetails, setTableDetails] = useState({})
  const [pageDetails, setPageDetails] = useState([])

  const [subProductLoading, setSubProductLoading] = useState(false)
  const [productItemLoading, setProductItemLoading] = useState(false)

  const _getProducts = () => {
    API.post('tokuchu/list_view', {
      is_archived: isArchieved,
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
        is_archived: isArchieved,
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
        is_archived: isArchieved,
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
        setPageDetails(data.data)
        setTableDetails(data.data[0].components[0])
        console.log(data.data[0].components[0])
      })
      .catch(err => {})
  }

  const _deleteComponent = (sectionId, componentId) => {
    API.post('tokuchu/page/delete_component', {
      section_id: sectionId,
      component_id: componentId,
    })
      .then(data => {
        toast.success('Component Deleted Successfully')
      })
      .catch(err => {})
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

  const _addProduct = name => {
    API.post('tokuchu/add_product', {
      product_name: [name],
    })
      .then(data => {
        toast.success('Product added Successfully')
      })
      .catch(err => {})
  }

  const _addSubProduct = (name, productId) => {
    API.post('tokuchu/add_sub_product', {
      sub_product_name: name,
      product_id: productId,
    })
      .then(data => {
        toast.success('Sub Product added Successfully')
      })
      .catch(err => {})
  }

  const _addSubProductItem = (name, subProductId) => {
    API.post('tokuchu/add_sub_product_item', {
      sub_product_item_name: name,
      sub_product_id: subProductId,
    })
      .then(data => {
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
  }, [])

  return (
    <>
      <div className="tokachu-main row mx-5">
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
                                          onClick={() => _getDetails()}
                                        >
                                          <a>{prod.name}</a>
                                        </li>
                                      ))}

                                      <div className="col d-flex justify-content-center">
                                        <button
                                
                                          className="btn yg-font-size"
                                          onClick={() => {}}
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
                                onClick={() => {}}
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
                          onClick={() => {}}
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
          <Table tableObject={tableDetails} />
        </div>
      </div>
    </>
  )
}
