import React, { useEffect, useRef, useState } from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside'
import Header from '../../components/Header'
import NewsItem from '../../components/News Components/NewsItem'
import PrimaryHeading from '../../components/Primary Headings'
import API from '../../utils/api'
import { getToken, getUserRoles } from '../../utils/token'
import Filtermg from '../../assets/Icon awesome-filter.png'
import Plusicon from '../../assets/Group 331.png'
import { Pagination } from 'antd'
import { toast } from 'react-toastify'
import { useLoading } from '../../utils/LoadingContext'
import { useNavigate } from 'react-router'
import ProductCard from '../../components/ProductCard/productcard'
import { Link, Router } from 'react-router-dom'

const ProductLine = () => {
  const isAdmin =
    getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'

  const navigate = useNavigate()
  const [archivedFilter, setArchivedFilter] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [productList, setProductList] = useState([])

  const getProductList = () => {
    setIsLoading(true)
    API.post('products/list_view', {
      is_archived: archivedFilter,
    })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          const productList = res.data.slice()
          productList.sort((a, b) => a.name.localeCompare(b.name))
          setProductList(productList)
        }
        setIsLoading(false)
      })
      .catch(error => {
        console.log(error)
        setIsLoading(false)
      })
  }

  const updateProduct = async payload => {
    const response = await API.post('products/add/product', payload)
    getProductList()
    toast.success(response.data.message)
  }

  const archiveProducts = id => {
    setIsLoading(true)
    API.post('products/page/set_archive', {
      id: id,
      archive_type: 'product',
    })
      .then(res => {
        toast.success(res.message)
        getProductList()
      })
      .catch(error => {
        console.log(error)
      })
  }

  const renderRow = () => {
    let rows = []
    let col = []
    productList.forEach((item, index) => {
      col.push(
        <ProductCard
          archive={archivedFilter}
          key={item.id}
          index={index}
          item={item}
          isAdmin={isAdmin}
          onArchiveClick={() => {
            archiveProducts(item.id)
          }}
          onClick={() => {
            if (item?.tokuchu) navigate('/admin/approved-tokuchus')
            else navigate('/product-lines/sub-product', { state: item })
          }}
          onUpdate={payload => {
            updateProduct(payload)
          }}
        />
      )
      // if ((index + 1) % 2 === 0 && index + 1 <= productList.length) {
      //   rows.push(<div className="row mt-0 mt-lg-5">{col}</div>)
      //   col = []
      // } else if ((index + 1) % 2 !== 0 && index + 1 === productList.length) {
      //   col.push(<div key={item.id} className={`col-12 col-md ms-lg-5 px-2 py-3`}></div>)
      //   rows.push(<div className="row mt-0 mt-lg-5">{col}</div>)
      //   col = []
      // }
    })
    return col
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
      <div className="row mx-2 mx-lg-5 h-100">
        <div className="col center py-3">
          <PrimaryHeading title={'Product Lines'} backgroundImage={'Product-line'} />
          {isLoading ? (
            <div className="col text-center mt-3">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row">{renderRow()}</div>
          )}
          {(getUserRoles() == 'PMK Administrator' ||
            getUserRoles() == 'PMK Content Manager' ||
            getUserRoles() == 'Technical Administrator') && (
            <div className="archived-filter mt-5 mb-5">
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
          )}
        </div>
      </div>
    </>
  )
}

export default ProductLine
