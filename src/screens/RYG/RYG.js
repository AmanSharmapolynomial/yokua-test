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
import RYGCard from '../../components/ProductCard/RYGCard'

const RYG = () => {
  const isAdmin =
    getUserRoles() == 'Technical Administrator' ||
    getUserRoles() == 'PMK Administrator' ||
    getUserRoles() == 'PMK Content Manager'

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [productList, setProductList] = useState([])

  const getProductList = () => {
    setIsLoading(true)
    API.get('/ryg_info/list_view')
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

  const updateProduct = async payload => {
    const response = await API.post('/ryg_info/upsert/ryg_info', payload)
    getProductList()
    toast.success(response.data.message)
  }

  const renderRow = () => {
    let rows = []
    let col = []
    productList.forEach((item, index) => {
      col.push(
        <RYGCard
          key={item.id}
          index={index}
          item={item}
          isAdmin={isAdmin}
          onClick={() => {
            navigate('/ryg-information/details', { state: item })
          }}
          onUpdate={payload => {
            updateProduct(payload)
          }}
        />
      )
      if ((index + 1) % 3 === 0 && index + 1 <= productList.length) {
        rows.push(<div className="row mt-0 mt-md-5">{col}</div>)
        col = []
      } else if ((index + 1) % 3 !== 0 && index + 1 === productList.length) {
        col.push(<div key={item.id} className={`col-12 col-md ms-md-5 px-2 py-3`}></div>)
        rows.push(<div className="row mt-0 mt-md-5">{col}</div>)
        col = []
      }
    })
    return rows
  }

  useEffect(() => {
    getProductList()
  }, [])

  return (
    <>
      <Header
        isLogedIn={getToken()}
        isAdmin={
          getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'
        }
      />
      <div className="row mx-2 mx-md-5 h-100">
        <div className="col center py-md-3">
          <PrimaryHeading title={'RYG Information'} />
          {isLoading ? (
            <div className="col text-center mt-3">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="col">{renderRow()}</div>
          )}
        </div>
      </div>
    </>
  )
}

export default RYG
