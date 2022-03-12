import React, { useEffect, useRef, useState } from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside'
import Header from '../../components/Header'
import NewsItem from '../../components/News Components/NewsItem'
import PrimaryHeading from '../../components/Primary Headings'
import API from '../../utils/api'
import { getToken, getUserRoles } from '../../utils/token'
import './style.css'

import { Pagination } from 'antd'

const NewsScreen = () => {
  const filter1Ref = useRef()
  const filter2Ref = useRef()

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
    API.post('news/', payload).then(data => {
      if (data.status == 200) {
        setBackendData(data.data)

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
        getAllNews(payload)
      })
      .catch(error => {
        console.log('Something went wrong', error)
      })
  }

  const saveAndExitAdd = () => {
    setNewNews(false)
  }

  const cancelAddNews = id => {
    const updatedNewsData = newsData
    const index = updatedNewsData.findIndex(item => item.id == id)
    updatedNewsData.splice(index, 1)
    setNewsData([...updatedNewsData])
  }

  function onChange(pageNumber) {
    debugger
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
      <div className="profile-setting-container">
        <PrimaryHeading title={'News'} />
        <div className="filter-and-read-container">
          <div className="filter-container">
            <div className="filter-actions">
              <div className="filter-icons">
                <i
                  className="fa-solid fa-filter has-dropdown"
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
                            setCategoryFilter(null)
                            setSubCategoryFilter(null)
                          } else {
                            setCategoryFilter(category.id)
                          }
                        }}
                      >
                        {category.category_name}
                      </span>
                    ))}
                </div>
              </div>
              <div className="filter-icons">
                {categoryFilter && backendData.sub_categories.length > 0 && (
                  <i
                    className="fa-solid fa-filter has-dropdown"
                    onClick={() => {
                      setShowFilterDropdown2(!showFilterDropdown2)
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
                    backendData.sub_categories.map((category, index) => (
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
              const payloadArr = []
              newsData.map(news => {
                payloadArr.push(news.id)
              })
              markAsReadAction(payloadArr)
            }}
          >
            Mark as Read
          </button>
        </div>
        {isLoading ? (
          <span>Loading....</span>
        ) : (
          <div className="news-container-list">
            {newsData.length > 0 ? (
              newsData.map((news, index) => {
                console.log(news)
                if (news && Object.keys(news).length > 1) {
                  return (
                    <NewsItem
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
              <span> You're all caught up with the News </span>
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
              getUserRoles() == 'Technical Administrator') && (
              <div
                className="add_row"
                onClick={() => {
                  setNewsData([...newsData, { id: Math.random() }])
                }}
              >
                <i
                  className="fa-solid fa-plus"
                  style={{
                    backgroundColor: 'var(--bgColor2)',
                  }}
                />{' '}
                Add
              </div>
            )}
          </div>
        )}
        {newsData.length > 0 && (
          <div className="pagination">
            <Pagination
              total={totalPages * 8}
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
              className="btn"
              onClick={() => {
                setArchivedFilter(false)
              }}
            >
              Live News
            </button>
          ) : (
            <button
              className="btn"
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

export default NewsScreen
