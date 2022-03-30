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

const NewsScreen = () => {
  const { setLoading } = useLoading()
  const filter1Ref = useRef()
  const filter2Ref = useRef()
  const [isAnyNewsUnderEdit, setNewsUnderEdit] = useState(false)
  const [isCheckListActivated, setCheckListActivated] = useState(false)

  const [showFilterDropdown1, setShowFilterDropdown1] = useState()
  const [showFilterDropdown2, setShowFilterDropdown2] = useState()
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [subCategoryFilter, setSubCategoryFilter] = useState(null)
  const [archivedFilter, setArchivedFilter] = useState(false)

  const [backendData, setBackendData] = useState()
  const [newsData, setNewsData] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [newNews, setNewNews] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [pageNoCall, setPageNoCall] = useState(1)

  const [readNews, setNewsRead] = useState([])

  const _updateNewsRead = id => {
    const updatedReadNews = readNews
    const isAlreadyAdded = updatedReadNews.findIndex(item => item == id)
    if (isAlreadyAdded > -1) {
      updatedReadNews.splice(isAlreadyAdded, 1)
    } else {
      updatedReadNews.push(id)
    }
    setNewsRead(p => [...updatedReadNews])
  }

  let payload = {
    category_id: parseInt(categoryFilter),
    sub_category_id: parseInt(subCategoryFilter),
    archived: archivedFilter,
    page_index: pageNoCall,
  }

  useEffect(() => {
    const handleOnScroll = window.addEventListener('scroll', () => {
      setShowFilterDropdown1(false)
      setShowFilterDropdown2(false)
    })
    return handleOnScroll
  }, [])

  useEffect(async () => {
    payload = {
      category_id: parseInt(categoryFilter),
      sub_category_id: parseInt(subCategoryFilter),
      archived: archivedFilter,
      page_index: pageNoCall,
    }
    getAllNews(payload)

    // const getAllNews = await API.post('news/', payload)
    //
    // console.log(getAllNews)
    // if (getAllNews.status == 200) {
    //   setBackendData(getAllNews.data)
    // }
    // setTotalPages(getAllNews.data.total_pages)
  }, [archivedFilter, categoryFilter, subCategoryFilter, isLoading, pageNoCall])

  const getAllNews = payload => {
    setLoading(true)
    API.post('news/', payload).then(data => {
      setLoading(false)
      if (data.status == 200) {
        setBackendData(data.data)
        setLoading(false)

        data.data ? setNewsData(data.data.news_letters) : setNewsData([])
      }
      setTotalPages(data.data.total_pages)
    })
  }

  const markAsReadAction = array => {
    const markAsPayload = {
      news_id: array,
    }
    API.post('/news/mark_read', markAsPayload)
      .then(data => {
        setCheckListActivated(false)
        getAllNews(payload)
      })
      .catch(error => {
        console.log('Something went wrong', error)
      })
  }

  const saveAndExitAdd = () => {
    setNewsUnderEdit(false)
    setNewNews(false)
  }

  const cancelAddNews = id => {
    setNewsUnderEdit(false)
    const updatedNewsData = newsData
    const index = updatedNewsData.findIndex(item => item.id == id)
    updatedNewsData.splice(index, 1)
    setNewsData([...updatedNewsData])
  }

  function onChange(pageNumber) {
    setPageNoCall(pageNumber)
  }

  const closeDropdown1 = () => {
    setShowFilterDropdown1(false)
  }

  const ref1 = useDetectClickOutside({ onTriggered: closeDropdown1 })

  const closeDropdown2 = () => {
    setShowFilterDropdown2(false)
  }

  const ref2 = useDetectClickOutside({ onTriggered: closeDropdown2 })

  return (
    <>
      <Header
        isLogedIn={getToken()}
        isAdmin={
          getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'
        }
      />
      <div className="row mx-5">
        <div className="profile-setting-container col center py-md-3">
          <PrimaryHeading title={'News'} backgroundImage={'yk-back-image-news'} />
          <div className="filter-and-read-container py-3">
            <div className="filter-container">
              <div className="filter-actions">
                <div className="filter-icons" style={{ marginLeft: '2rem' }}>
                  <img
                    className={categoryFilter === null ? 'greyed' : null}
                    src={Filtermg}
                    onClick={() => {
                      setShowFilterDropdown1(!showFilterDropdown1)
                    }}
                    ref={ref1}
                  />
                  <div
                    className="filter-dropdown dropdown"
                    style={{
                      display: showFilterDropdown1 ? 'flex' : 'none',
                    }}
                  >
                    {backendData &&
                      backendData.categories.map((category, index) => (
                        <span
                          key={index}
                          className="dropdown-element"
                          ref={filter1Ref}
                          style={
                            categoryFilter == category.id
                              ? {
                                  fontWeight: 'bold',
                                }
                              : {
                                  fontWeight: '300',
                                }
                          }
                          onClick={() => {
                            if (categoryFilter == category.id) {
                              toast.success('Category filter removed')
                              setCategoryFilter(null)
                              setSubCategoryFilter(null)
                            } else {
                              toast.success('Category filter Applied')
                              setCategoryFilter(category.id)
                            }
                          }}
                        >
                          {category.category_name}
                        </span>
                      ))}
                  </div>
                </div>
                <div className="filter-icons" style={{ marginLeft: '12rem' }}>
                  {backendData?.sub_categories?.length > 0 && (
                    <img
                      className={subCategoryFilter === null ? 'greyed' : null}
                      src={Filtermg}
                      onClick={() => {
                        if (categoryFilter) {
                          if (showFilterDropdown2) {
                            toast.success('Sub Category filter applied')
                          } else {
                            toast.success('Sub Category filter removed')
                          }
                          setShowFilterDropdown2(!showFilterDropdown2)
                        } else {
                          toast.success('Please select the Category filter first.')
                        }
                      }}
                      ref={ref2}
                    />
                  )}
                  <div
                    className="filter-dropdown dropdown"
                    style={{
                      display: showFilterDropdown2 ? 'flex' : 'none',
                    }}
                  >
                    {backendData &&
                      backendData.sub_categories
                        .filter(item => item.category_id == categoryFilter)
                        .map((category, index) => (
                          <span
                            key={index}
                            className="dropdown-element"
                            ref={filter2Ref}
                            style={{
                              fontWeight: subCategoryFilter == category.id ? 'bold' : '300',
                            }}
                            onClick={() => {
                              if (subCategoryFilter == category.id) {
                                setSubCategoryFilter(null)
                              } else {
                                setSubCategoryFilter(category.id)
                              }
                            }}
                          >
                            {category.sub_category_name}
                            Something
                          </span>
                        ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              className="btn"
              onClick={() => {
                markAsReadAction(readNews)
              }}
            >
              Mark as Read
            </button>
          </div>
          {isLoading ? (
            <span>Loading....</span>
          ) : (
            <div className="col">
              <div className="row d-flex justify-content-center">
                {newsData.length > 0 ? (
                  newsData.map((news, index) => {
                    if (news && Object.keys(news).length > 1) {
                      return (
                        <NewsItem
                          setCheckListActivated={setCheckListActivated}
                          isCheckListActivated={isCheckListActivated}
                          isAnyNewsUnderEdit={isAnyNewsUnderEdit}
                          setNewsUnderEdit={setNewsUnderEdit}
                          setCategoryFilter={() => {
                            if (categoryFilter) {
                              toast.success('Category filter removed')
                              setCategoryFilter(null)
                            } else {
                              toast.success('Category filter applied')
                              setCategoryFilter(news?.category_id)
                            }
                          }}
                          categoryFilter={categoryFilter}
                          updateNewsRead={() => _updateNewsRead(news.id)}
                          readNews={readNews}
                          data={news}
                          changeType={'View'}
                          tempCategory={backendData.categories}
                          tempSubCategory={backendData.sub_categories}
                          key={index}
                          setIsLoading={setIsLoading}
                          refreshPage={() => getAllNews(payload)}
                        />
                      )
                    } else {
                      return (
                        <NewsItem
                          isAnyNewsUnderEdit={isAnyNewsUnderEdit}
                          setNewsUnderEdit={setNewsUnderEdit}
                          updateNewsRead={() => _updateNewsRead(news.id)}
                          readNews={readNews}
                          getAllNews={() => getAllNews(payload)}
                          cancelAddNews={id => cancelAddNews(id)}
                          data={{}}
                          changeType={'Add'}
                          tempCategory={backendData.categories}
                          tempSubCategory={backendData.sub_categories}
                          saveAndExitAdd={saveAndExitAdd}
                          setIsLoading={setIsLoading}
                          refreshPage={() => getAllNews(payload)}
                        />
                      )
                    }
                  })
                ) : (
                  <>
                    {backendData?.news_letters.length < 1 ? (
                      <span>No Records Found</span>
                    ) : (
                      <span> You're all caught up with the News </span>
                    )}
                  </>
                )}

                {/*{newNews ? (*/}
                {/*  <NewsItem*/}
                {/*    data={undefined}*/}
                {/*    changeType={true}*/}
                {/*    category={backendData.categories}*/}
                {/*    subCategory={backendData.sub_categories}*/}
                {/*    saveAndExitAdd={saveAndExitAdd}*/}
                {/*    setIsLoading={setIsLoading}*/}
                {/*  />*/}
                {/*) : (*/}
                {/*  <></>*/}
                {/*)}*/}

                {(getUserRoles() == 'PMK Administrator' ||
                  getUserRoles() == 'PMK Content Manager' ||
                  getUserRoles() == 'Technical Administrator') &&
                  !archivedFilter && (
                    <div
                      className="add_row mt-3"
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
            </div>
          )}
          {newsData.length > 0 && (
            <div className="pagination">
              <Pagination
                total={totalPages * 10}
                showQuickJumper
                showSizeChanger={false}
                onChange={onChange}
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
      </div>
    </>
  )
}

export default NewsScreen
