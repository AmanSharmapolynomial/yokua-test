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
import { Link, Router, useLocation } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import Breadcrumb from '../../components/Breadcrumb'

const ProductLine = ({ archieve }) => {
  // Get the location
  const currentPath = window.location.pathname
  console.log(currentPath)

  const isAdmin =
    getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'
  const navigate = useNavigate()
  // const [archivedFilter, setArchivedFilter] = useState(archieve)
  const [isLoading, setIsLoading] = useState(false)
  const [productList, setProductList] = useState([])

  const getProductList = () => {
    setIsLoading(true)
    API.post('products/list_view', {
      is_archived: archieve,
    })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          const productList = res.data.slice()
          //productList.sort((a, b) => a.name.localeCompare(b.name))
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
    console.log('PRODUCT LIST', productList)
    productList.forEach((item, index) => {
      col.push(
        <ProductCard
          archive={archieve}
          key={item.id}
          index={index}
          item={item}
          isAdmin={isAdmin}
          onArchiveClick={() => {
            archiveProducts(item.id)
          }}
          onClick={() => {
            const updatedItem = item
            updatedItem.is_archived = archieve
            if (item?.tokuchu) navigate('/admin/approved-tokuchus')
            else
              navigate(
                `/product-lines/sub-product/?itemId=${item.id}&archiveStatus=${archieve}&itemName=${
                  item.sub_product_name || item.name
                }`,
                { state: updatedItem }
              )
          }}
          onUpdate={payload => {
            updateProduct(payload)
          }}
        />
      )
    })
    return col
  }

  useEffect(() => {
    getProductList()
  }, [archieve])

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
          <div className="col-12 col-lg-5 border-md rounded py-2 my-2">
            <div className="row">
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
                <u
                  role="button"
                  onClick={() => {
                    navigate('/home')
                  }}
                >
                  Home
                </u>
                {' > '}{' '}
                <u
                  role="button"
                  onClick={() => {
                    {
                      currentPath === '/product-lines' ? navigate() : navigate('/product-lines')
                    }
                  }}
                >
                  {currentPath === '/product-lines'
                    ? 'Field Instruments'
                    : 'Field Instruments > Archive '}
                </u>
              </span>
            </div>
          </div>
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
              {archieve ? (
                <button
                  className="btn"
                  style={{ display: 'grid', placeItems: 'center' }}
                  onClick={() => {
                    navigate('/product-lines')
                  }}
                >
                  Live Product
                </button>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductLine
