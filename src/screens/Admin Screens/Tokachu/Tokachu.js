import React, { useEffect, useState } from 'react'
import API from '../../../utils/api'
import '../Tokachu/Tokachu.css'

export default () => {
  const [isArchieved, setIsArchived] = useState(false)
  const [products, setProducts] = useState([])
  const [subProducts, setSubProducts] = useState([])
  const [productItems, setProductItems] = useState([])

  const _getProducts = () => {
    API.post('tokuchu/list_view', {
      is_archived: isArchieved,
    })
      .then(data => {
        console.log(data.data)
        setProducts(data.data)
      })
      .catch(err => console.log(err))
  }

  const _getSubProducts = (productId = 1) => {
    API.post('tokuchu/list_view/sub_products/', {
      product_id: productId,
      is_archived: isArchieved,
    })
      .then(data => {
        setSubProducts(data.data)
      })
      .catch(err => console.log(err))
  }

  const _getProductItems = subProductId => {
    API.post('tokuchu/list_view/sub_products_item/', {
      sub_product_id: subProductId,
      is_archived: isArchieved,
    })
      .then(data => {
        setProductItems(data.data)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    _getProducts()
  }, [])

  return (
    <div className="container">
      <div className="toku-dropdn">
        <div className="row">
          <div className="dropdown">
            <div className="btn-group">
              <button className="btn btn-secondary btn-main btn-sm" type="button" data-toggle="dropdown">
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
              <ul className="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu">
                <li className="dropdown-submenu">
                  <a className="dropdown-item" tabIndex="-1">
                    RAMC <i className="fa fa-chevron-right mt-1" aria-hidden="true"></i>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="dropdown-item">
                      <a tabIndex="-1">RAMC - all <i className="fa fa-chevron-right mt-1" aria-hidden="true"></i></a>
                    </li>
                    <li className="dropdown-submenu">
                      <ul className="dropdown-menu">
                        <li className="dropdown-item">
                          <a>3rd level</a>
                        </li>
                        <li className="dropdown-submenu">
                          <a className="dropdown-item">another level</a>
                          <ul className="dropdown-menu">
                            <li className="dropdown-item">
                              <a>4th level</a>
                            </li>
                            <li className="dropdown-item">
                              <a>4th level</a>
                            </li>
                            <li className="dropdown-item">
                              <a>4th level</a>
                            </li>
                          </ul>
                        </li>
                        <li className="dropdown-item">
                          <a>3rd level</a>
                        </li>
                      </ul>
                    </li>
                    <li className="dropdown-item">
                      <a>RAMC01 <i className="fa fa-chevron-right mt-1" aria-hidden="true"></i></a>
                    </li>
                    <li className="dropdown-item">
                      <a>RAMC02 <i className="fa fa-chevron-right mt-1" aria-hidden="true"></i></a>
                    </li>
                  </ul>
                </li>

                <li className="dropdown-submenu">
                  <a className="dropdown-item" tabIndex="-1">
                    RAMC <i className="fa fa-chevron-right mt-1" aria-hidden="true"></i>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="dropdown-item">
                      <a tabIndex="-1">Second level</a>
                    </li>
                    <li className="dropdown-submenu">
                      <ul className="dropdown-menu">
                        <li className="dropdown-item">
                          <a>3rd level</a>
                        </li>
                        <li className="dropdown-submenu">
                          <a className="dropdown-item">another level</a>
                          <ul className="dropdown-menu">
                            <li className="dropdown-item">
                              <a>4th level</a>
                            </li>
                            <li className="dropdown-item">
                              <a>4th level</a>
                            </li>
                            <li className="dropdown-item">
                              <a>4th level</a>
                            </li>
                          </ul>
                        </li>
                        <li className="dropdown-item">
                          <a>3rd level</a>
                        </li>
                      </ul>
                    </li>
                    <li className="dropdown-item">
                      <a>Second level</a>
                    </li>
                    <li className="dropdown-item">
                      <a>Second level</a>
                    </li>
                  </ul>
                </li>

                <li className="dropdown-submenu">
                  <a className="dropdown-item" tabIndex="-1">
                    RAMC <i className="fa fa-chevron-right mt-1" aria-hidden="true"></i>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="dropdown-item">
                      <a tabIndex="-1">Second level</a>
                    </li>
                    <li className="dropdown-submenu">
                      <ul className="dropdown-menu">
                        <li className="dropdown-item">
                          <a>3rd level</a>
                        </li>
                        <li className="dropdown-submenu">
                          <a className="dropdown-item">another level</a>
                          <ul className="dropdown-menu">
                            <li className="dropdown-item">
                              <a>4th level</a>
                            </li>
                            <li className="dropdown-item">
                              <a>4th level</a>
                            </li>
                            <li className="dropdown-item">
                              <a>4th level</a>
                            </li>
                          </ul>
                        </li>
                        <li className="dropdown-item">
                          <a>3rd level</a>
                        </li>
                      </ul>
                    </li>
                    <li className="dropdown-item">
                      <a>Second level</a>
                    </li>
                    <li className="dropdown-item">
                      <a>Second level</a>
                    </li>
                  </ul>
                </li>

                <li className="dropdown-submenu">
                  <a className="dropdown-item" tabIndex="-1">
                    RAMC<i className="fa fa-chevron-right mt-1" aria-hidden="true"></i>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="dropdown-item">
                      <a tabIndex="-1">Second level</a>
                    </li>
                    <li className="dropdown-submenu">
                      <ul className="dropdown-menu">
                        <li className="dropdown-item">
                          <a>3rd level</a>
                        </li>
                        <li className="dropdown-submenu">
                          <a className="dropdown-item">another level</a>
                          <ul className="dropdown-menu">
                            <li className="dropdown-item">
                              <a>4th level</a>
                            </li>
                            <li className="dropdown-item">
                              <a>4th level</a>
                            </li>
                            <li className="dropdown-item">
                              <a>4th level</a>
                            </li>
                          </ul>
                        </li>
                        <li className="dropdown-item">
                          <a>3rd level</a>
                        </li>
                      </ul>
                    </li>
                    <li className="dropdown-item">
                      <a>Second level</a>
                    </li>
                    <li className="dropdown-item">
                      <a>Second level</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
