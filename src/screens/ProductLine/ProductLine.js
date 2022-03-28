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
import placeholder from '../../assets/placeholder.png'
import editIcon from '../../assets/Icon awesome-edit.png'

const ProductLine = () => {
  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const [isAnyNewsUnderEdit, setNewsUnderEdit] = useState(false)
  const [isCheckListActivated, setCheckListActivated] = useState(false)

  const [categoryFilter, setCategoryFilter] = useState(null)
  const [archivedFilter, setArchivedFilter] = useState(false)

  const [backendData, setBackendData] = useState()

  const [isLoading, setIsLoading] = useState(false)
  const [newNews, setNewNews] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [pageNoCall, setPageNoCall] = useState(1)
  const [isArchived] = useState(false)
  const [productList, setProductList] = useState([])

  const getProductList = () => {
    setIsLoading(true)
    API.post('products/list_view', {
      is_archived: isArchived,
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
          console.log(res.data)
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
      //0 total 3
      col.push(
        <div
          key={item.id}
          className={`col-12 col-md card ${index % 2 === 0 ? 'mr-md-5' : 'ms-md-5'} px-2 py-3`}
        >
          <div className="row">
            <div className="col">
              <div className="row">
                <div className="col-6">
                  <div className="img-box thumb rounded d-flex">
                    <img className="img" src={item.image_link ? item.image_link : placeholder} />
                  </div>
                  <div className="border text-center rounded mt-2">{item.name}</div>
                </div>
                <div className="col-6 d-flex align-items-center">{item.description}</div>
              </div>
            </div>
            <span className="col-auto d-none d-md-block">
              <img src={editIcon} />
            </span>
          </div>
        </div>
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
  }, [])

  return (
    <>
      <Header
        isLogedIn={getToken()}
        isAdmin={
          getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'
        }
      />
      <div className="col center py-3 px-5">
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
        {productList.length > 0 && (
          <div className="pagination">
            <Pagination
              total={totalPages * 10}
              showQuickJumper
              showSizeChanger={false}
              // onChange={onChange}
              style={{ border: 'none' }}
            />
          </div>
        )}
        <div className="archived-filter">
          {archivedFilter ? (
            <button
              className="btn ml-3"
              style={{ display: 'grid', placeItems: 'center' }}
              onClick={() => {
                setArchivedFilter(false)
              }}
            >
              Live News
            </button>
          ) : (
            <button
              className="btn ml-3"
              style={{ display: 'grid', placeItems: 'center' }}
              onClick={() => {
                setArchivedFilter(true)
              }}
            >
              News Archive
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductLine
