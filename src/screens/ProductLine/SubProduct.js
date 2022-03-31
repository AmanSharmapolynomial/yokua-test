import React, { useEffect, useRef, useState } from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside'
import Header from '../../components/Header'
import NewsItem from '../../components/News Components/NewsItem'
import PrimaryHeading from '../../components/Primary Headings'
import API from '../../utils/api'
import { getToken, getUserRoles } from '../../utils/token'
import './style.css'
import Filtermg from '../../assets/Icon awesome-filter.png'
import Plusicon from '../../assets/Group 331.png'
import { Pagination } from 'antd'
import { toast } from 'react-toastify'
import { useLoading } from '../../utils/LoadingContext'
import { useNavigate } from 'react-router'
import { useLocation } from 'react-router-dom'

import ProductCard from '../../components/ProductCard/productcard'

const SubProduct = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { setLoading } = useLoading()
  const [archivedFilter, setArchivedFilter] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [productList, setProductList] = useState([])

  const getProductList = () => {
    setIsLoading(true)
    API.post('products/list_view/sub_products/', {
      is_archived: archivedFilter,
      product_id: state.id,
    })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          setProductList(res.data)
        }
        setIsLoading(false)
      })
      .catch(error => {
        console.log(error)
        setIsLoading(false)
      })
  }

  const renderRow = () => {
    let rows = []
    let col = []
    productList.forEach((item, index) => {
      col.push(
        <ProductCard
          index={index}
          item={item}
          subProduct={true}
          onClick={() => {
            navigate('/product-lines/product-detail', { state: { ...item, parentId: state.id } })
          }}
        />
      )
      if ((index + 1) % 2 === 0 && index + 1 <= productList.length) {
        rows.push(<div className="row mt-5">{col}</div>)
        col = []
      } else if ((index + 1) % 2 !== 0 && index + 1 === productList.length) {
        col.push(<div key={item.id} className={`col-12 col-md ms-md-5 px-2 py-3`}></div>)
        rows.push(<div className="row mt-5">{col}</div>)
        col = []
      }
    })
    return rows
  }

  useEffect(() => {
    getProductList()
  }, [archivedFilter])

  return (
    <>
      <Header
        isLogedIn={getToken()}
        isAdmin={
          getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'
        }
      />
      <div className="row mx-5">
        <div className="col center py-3">
          <div className="row">
            <div className="col-12 col-md-6 border rounded py-2">
              <div className="row">
                <span
                  className="col-6 light-grey"
                  onClick={() => {
                    navigate(-1)
                  }}
                >
                  Previous page
                </span>
                <span className="col-6">
                  <u>Product Lines</u> {'>'} {state.name}
                </span>
              </div>
            </div>
          </div>
          <div className="row mt-5 text-bold">{state.name}</div>
          {isLoading ? (
            <div className="col text-center">Loading....</div>
          ) : (
            <div className="col">{renderRow()}</div>
          )}
          <div className="archived-filter mt-5">
            {archivedFilter ? (
              <button
                className="btn"
                style={{ display: 'grid', placeItems: 'center' }}
                onClick={() => {
                  setArchivedFilter(false)
                }}
              >
                Live Product
              </button>
            ) : (
              <button
                className="btn"
                style={{ display: 'grid', placeItems: 'center' }}
                onClick={() => {
                  setArchivedFilter(true)
                }}
              >
                Product Archive
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SubProduct