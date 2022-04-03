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
import Table from '../../components/TableComponent/Table'

const ProductDetail = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { setLoading } = useLoading()
  const [archivedFilter, setArchivedFilter] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [productDetail, setProductDetail] = useState([])

  const getProductDetails = () => {
    setIsLoading(true)
    API.post('products/details/', {
      is_archived: archivedFilter,
      parent_id: state.id,
    })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          setProductDetail(res.data)
        }
        setIsLoading(false)
      })
      .catch(error => {
        console.log(error)
        setIsLoading(false)
      })
  }

  const renderType = ele => {
    if (ele.type === 'binary') {
      return (
        <div className="col-12 mt-4">
          <div className="row">
            <span className="flex-fill">{ele.title}</span>
            <a className="bordered-btn rounded" role={'button'} href={ele.binary_link} download>
              Download
            </a>
          </div>
        </div>
      )
    } else if (ele.type === 'table') {
      return <Table tableObject={ele.table_data} setShowDeleteModal={false} />
    }
  }

  const renderComponents = () =>
    productDetail.map((item, index) => (
      <div className="col-12 mt-5">
        <div className="row">
          <span className="text-bold">{item.sectionName}</span>
        </div>
        <div className="row">{item.components.map((ele, idx) => renderType(ele))}</div>
      </div>
    ))

  useEffect(() => {
    getProductDetails()
  }, [])

  return (
    <>
      <Header
        isLogedIn={getToken()}
        isAdmin={
          getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'
        }
      />
      <div className="row mx-5 h-100">
        <div className="col center py-3">
          <div className="row">
            <div className="col-12 col-md-6 border rounded py-2">
              <div className="row">
                <span
                  role="button"
                  className="col-6 light-grey"
                  onClick={() => {
                    navigate(-1)
                  }}
                >
                  Previous page
                </span>
                <span className="col-6">
                  <u
                    role="button"
                    onClick={e => {
                      navigate('/product-lines')
                    }}
                  >
                    Product Lines
                  </u>
                  {'>'} {state.sub_product_name}
                </span>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="col text-center">Loading....</div>
          ) : (
            <div className="row">{renderComponents()}</div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductDetail
