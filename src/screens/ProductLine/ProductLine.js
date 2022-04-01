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
import ProductCard from '../../components/ProductCard/productcard'
import { Link, Router } from 'react-router-dom'

const ProductLine = () => {
  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const [archivedFilter, setArchivedFilter] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [productList, setProductList] = useState([])

  const getProductList = () => {
    setIsLoading(true)
    API.post('products/list_view', {
      is_archived: archivedFilter,
    })
      .then(res => {
        // const staticProductLine = [
        //   {
        //     id: -1,
        //     name: 'Rotameter',
        //     image_link: '',
        //     is_archived: false,
        //     isStatic: true,
        //     route: 'rotameter',
        //   },
        //   {
        //     id: -2,
        //     name: 'Approved Tokuchus',
        //     image_link: '',
        //     is_archived: false,
        //     isStatic: true,
        //     route: 'approved-tokuchus',
        //   },
        // ]
        // const data = [...res.data, ...staticProductLine]

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

  const updateProduct = async id => {
    const payload = {
      id: id,
      product_name: 'Vortex-Yewflo',
      description: 'A paragraph of text',
    }

    if (payload.email_id != '') {
      const afterAddOrDeleteMsg = await API.post('products/add/product', payload)
      if (data.imageFile) {
        const formData = new FormData()

        formData.append('image', data.imageFile)
        formData.append('email', data.email)
        await API.post('auth/update_avatar', formData)
          .then(data => {
            setReloadData(true)
          })
          .catch(error => {
            // toast.error('Error while updating Avatar')
          })
      }
      toast.success(afterAddOrDeleteMsg.data.message)
    } else {
      toast.error('Enter E-Mail')
    }
    setReloadTable(!reloadTable)
  }

  const renderRow = () => {
    let rows = []
    let col = []
    productList.forEach((item, index) => {
      col.push(
        <ProductCard
          index={index}
          item={item}
          onClick={() => {
            navigate('/product-lines/sub-product', { state: item })
          }}
        />
      )
      if ((index + 1) % 2 === 0 && index + 1 <= productList.length) {
        rows.push(<div className="row mt-0 mt-md-5">{col}</div>)
        col = []
      } else if ((index + 1) % 2 !== 0 && index + 1 === productList.length) {
        col.push(<div key={item.id} className={`col-12 col-md ms-md-5 px-2 py-3`}></div>)
        rows.push(<div className="row mt-0 mt-md-5">{col}</div>)
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
      <div className="row mx-5 h-100">
        <div className="col center py-md-3">
          <PrimaryHeading title={'Product Lines'} />
          {isLoading ? (
            <div className="col text-center">Loading....</div>
          ) : (
            <div className="col">{renderRow()}</div>
          )}

          {/* {(getUserRoles() == 'PMK Administrator' ||
              getUserRoles() == 'PMK Content Manager' ||
              getUserRoles() == 'Technical Administrator') &&
              !archivedFilter && (
                <div
                  className="add_row"
                  onClick={() => {
                    if (!isAnyNewsUnderEdit) {
                      setNewsUnderEdit(true)
                      setNewsData([...newsData, { id: Math.random() }])
                    } else {
                      toast.error('Please finish current news edit.')
                    }
                  }}
                >
                  <img
                    src={Plusicon}
                    style={{
                      width: '22px',
                      marginRight: '12px',
                    }}
                  />
                  Add
                </div>
              )}
          </div>
        )} */}
          {/* {productList.length > 0 && (
          <div className="pagination">
            <Pagination
              total={totalPages * 10}
              showQuickJumper
              showSizeChanger={false}
              // onChange={onChange}
              style={{ border: 'none' }}
            />
          </div>
        )} */}
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
        </div>
      </div>
    </>
  )
}

export default ProductLine
