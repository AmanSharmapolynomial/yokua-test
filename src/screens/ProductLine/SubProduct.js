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
import { useNavigate, useParams } from 'react-router'
import { useLocation } from 'react-router-dom'

import ProductCard from '../../components/ProductCard/productcard'
import htmlParser from 'html-react-parser'

const SubProduct = () => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const itemId = urlParams.get('itemId')
  const archiveStatus = urlParams.get('archiveStatus')
  const itemName = urlParams.get('itemName')

  const navigate = useNavigate()
  //const { state } = useLocation()
  const [state, setNewState] = useState({
    is_archived: archiveStatus,
    id: itemId,
    name: itemName,
  })
  const { setLoading } = useLoading()
  const { archived_status, subproduct_id } = useParams()
  const [archivedFilter, setArchivedFilter] = useState(state.is_archived == 'true' ? true : false)
  const [isLoading, setIsLoading] = useState(false)
  const [productList, setProductList] = useState([])

  const getProductList = () => {
    setIsLoading(true)
    API.post('products/list_view/sub_products/', {
      is_archived: archivedFilter,
      product_id: Number(state.id),
    })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          if (res.data.length === 1 && res.data[0].sub_product_name === 'proxy') {
            const item = res.data[0]
            navigate(`/product-lines/product-detail/`, {
              state: { ...item, sub_product_name: state.name, parentId: state.id },
            })
          } else {
            const temp = res.data
            temp.reverse()
            setProductList(temp)
          }
        }
        setIsLoading(false)
      })
      .catch(error => {
        console.log(error)
        setIsLoading(false)
      })
  }

  const updateSubProduct = async payload => {
    const response = await API.post('products/add/sub_product', payload)
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
      if (
        (index == 0 && state.name != item.section) ||
        (state.name != item.section &&
          // productList[index - 1].sub_product_name.split(' ')[0] !==
          //   productList[index].sub_product_name.split(' ')[0])
          item.section !== productList[index - 1].section)
      ) {
        col.push(
          <div
            className="row mt-4 text-bold d-none d-lg-block"
            style={{ marginTop: index == 0 ? '-10px' : '' }}
          >
            <div className="col">
              <b>{item.section}</b>
            </div>
          </div>
        )
      }
      col.push(
        <ProductCard
          archive={archivedFilter}
          key={item.id}
          index={index}
          item={item}
          subProduct={true}
          onArchiveClick={() => {
            archiveProducts(item.id)
          }}
          onClick={() => {
            const updatedItem = item
            updatedItem.is_archived = archivedFilter
            navigate(
              `/product-lines/product-detail/?pageId=${item.page_id}&productId=${item.id}&productArchivedStatus=${item.is_archived}&subProductName=${item.sub_product_name}`,
              {
                state: { ...updatedItem, parentId: state.id },
              }
            )
          }}
          onUpdate={payload => {
            updateSubProduct(payload)
          }}
        />
      )
      // if ((index + 1) % 2 === 0 && index + 1 <= productList.length) {
      //   rows.push(<div className="row mt-5">{col}</div>)
      //   col = []
      // } else if ((index + 1) % 2 !== 0 && index + 1 === productList.length) {
      //   col.push(<div key={item.id} className={`col-12 col-md ms-lg-5 px-2 py-3`}></div>)
      //   rows.push(<div className="row mt-5">{col}</div>)
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
          <div className="row">
            <div className="col">
              <div className="col-12 col-lg-5 border-md rounded py-2">
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
                        navigate('/product-lines')
                      }}
                    >
                      Field Instruments
                    </u>
                    {' > '}
                    <u
                      role="button"
                      onClick={() => {
                        navigate(-1)
                      }}
                    >
                      {archivedFilter ? (
                        <strong style={{ backgroundColor: 'yellow' }}> Archive </strong>
                      ) : (
                        'Live'
                      )}
                    </u>
                    {' > '} {htmlParser(state.name)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5 text-bold d-none d-lg-block">
            <div className="col" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
              {state.name}
            </div>
          </div>
          {isLoading ? (
            <div className="col text-center">Loading....</div>
          ) : (
            <div className="row">{renderRow()}</div>
          )}
          {/* <div className="archived-filter mt-5">
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
          </div> */}
        </div>
      </div>
    </>
  )
}

export default SubProduct
