import React, { useEffect, useState } from 'react'
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
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
// pre-wrap
const NewsScreen = () => {
  const { setLoading } = useLoading()
  const navigate = useNavigate()
  const [isAnyNewsUnderEdit, setNewsUnderEdit] = useState(false)
  const [isCheckListActivated, setCheckListActivated] = useState(false)

  const [category, setCategory] = useState(null)
  const [subCategory, setSubCategory] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [categoryFilterForSub, setCategoryFilterforSub] = useState(null)
  const [subCategoryFilter, setSubCategoryFilter] = useState(null)
  const [archivedFilter, setArchivedFilter] = useState(false)

  const [backendData, setBackendData] = useState()
  const [newsData, setNewsData] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [newNews, setNewNews] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [pageNoCall, setPageNoCall] = useState(1)

  const [readNews, setNewsRead] = useState([])

  const [isMobile, setIsMobile] = useState(false)

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

  useEffect(async () => {
    window.addEventListener('resize', handleResize)
    payload = {
      category_id: parseInt(categoryFilter),
      sub_category_id: parseInt(subCategoryFilter),
      archived: archivedFilter,
      page_index: pageNoCall,
    }
    getAllNews(payload)
  }, [archivedFilter, categoryFilter, subCategoryFilter, isLoading, pageNoCall])

  const handleResize = () => {
    if (window.innerWidth < 590) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }

  const getAllNews = payload => {
    setLoading(true)
    API.post('news/', payload).then(data => {
      setLoading(false)
      if (data.status === 200) {
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
        navigate(0)
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

  return (
    <>
      <Header
        isLogedIn={getToken()}
        isAdmin={
          getUserRoles() === 'Technical Administrator' || getUserRoles() === 'PMK Administrator'
        }
      />
      <div className="row mx-2 mx-lg-5 h-100">
        <div className="profile-setting-container col center py-3">
          <PrimaryHeading title={'News'} backgroundImage={'yk-back-image-news'} />
          <div className="row py-3">
            <div className="filter-actions filter-news col-6">
              <div className="filter-icons">
                <div className="dropdown">
                  <img
                    data-spy="affix"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    className={
                      categoryFilter === null
                        ? 'dropdown-toggle greyed filter-icon'
                        : 'dropdown-toggle filter-icon'
                    }
                    src={Filtermg}
                  />
                  <div className="ml-4" style={{ marginTop: '-1.4rem', zIndex: '1000' }}>
                    <Stack direction="row" spacing={1}>
                      {category ? (
                        <Tooltip title={'Category: ' + JSON.parse(category).category_name}>
                          <span className="chip">
                            <Chip
                              size="small"
                              label={
                                isMobile
                                  ? JSON.parse(category).category_name.slice(0, 5) + '...'
                                  : JSON.parse(category).category_name
                              }
                              variant="outlined"
                              onDelete={() => {
                                toast.success('Category filter removed')
                                setCategoryFilter(null)
                                setCategory(null)
                                setSubCategory(null)
                                setSubCategoryFilter(null)
                              }}
                            />
                          </span>
                        </Tooltip>
                      ) : (
                        ''
                      )}
                      {subCategory ? (
                        <Tooltip
                          title={'Sub-Category: ' + JSON.parse(subCategory).sub_category_name}
                        >
                          <span className="chip-sub">
                            <Chip
                              size="small"
                              label={
                                isMobile
                                  ? JSON.parse(subCategory).sub_category_name.slice(0, 5) + '...'
                                  : JSON.parse(subCategory).sub_category_name
                              }
                              variant="outlined"
                              onDelete={() => {
                                toast.success('Sub-category filter removed')
                                setSubCategoryFilter(null)
                                setSubCategory(null)
                              }}
                            />
                          </span>
                        </Tooltip>
                      ) : (
                        ''
                      )}
                    </Stack>
                  </div>
                  <div
                    className="dropdown-menu"
                    style={{
                      overflowY: 'scroll',
                      maxHeight: '10rem',
                      padding: '4px',
                    }}
                  >
                    <label for="categories" style={{ fontSize: 'small', fontWeight: 'bold' }}>
                      Choose a Category:
                    </label>
                    <select
                      style={{ cursor: 'pointer', padding: '0rem' }}
                      onClick={event => {
                        event.stopPropagation()
                      }}
                      value={category}
                      name="categories"
                      id="categories"
                      onChange={e => {
                        let obj = JSON.parse(e.target.value)
                        if (categoryFilter == obj.id && subCategoryFilter == null) {
                          toast.success('Category filter removed')
                          setCategoryFilter(null)
                          setCategory(null)
                          setSubCategory(null)
                          setSubCategoryFilter(null)
                        } else {
                          toast.success('Category filter applied')
                          setPageNoCall(1)
                          setCategory(JSON.stringify(obj))
                          setSubCategory(null)
                          setSubCategoryFilter(null)
                          setCategoryFilter(obj.id)
                          setCategoryFilterforSub(obj.id)
                        }
                      }}
                    >
                      <option value="">Select option</option>
                      {backendData &&
                        backendData.categories.map((category, index) => (
                          <>
                            <option
                              style={
                                categoryFilter === category.id
                                  ? {
                                      fontWeight: 'bold',
                                    }
                                  : {
                                      fontWeight: '300',
                                    }
                              }
                              value={JSON.stringify(category)}
                            >
                              {category.category_name}
                            </option>
                          </>
                        ))}
                    </select>
                    <label for="sub-categories" style={{ fontSize: 'small', fontWeight: 'bold' }}>
                      Choose a Sub-Category:
                    </label>
                    <select
                      value={subCategory}
                      name="sub-categories"
                      id="sub-categories"
                      disabled={category ? false : true}
                      style={
                        !category
                          ? { backgroundColor: '#E3E6E8', cursor: 'not-allowed', padding: '0rem' }
                          : { cursor: 'pointer', padding: '0rem' }
                      }
                      onClick={event => event.stopPropagation()}
                      onChange={e => {
                        let obj = JSON.parse(e.target.value)
                        if (subCategoryFilter === obj.id) {
                          toast.success('Sub-category filter removed')
                          setSubCategoryFilter(null)
                          setSubCategory(null)
                        } else {
                          toast.success('Sub-category filter applied')
                          setPageNoCall(1)
                          setSubCategory(JSON.stringify(obj))
                          setSubCategoryFilter(obj.id)
                        }
                      }}
                    >
                      <option value="">Select option</option>
                      {backendData &&
                        backendData.sub_categories
                          .filter(item => item.category_id == categoryFilter)
                          .map((subc, index) => (
                            <option
                              key={index}
                              style={{
                                fontWeight: subCategoryFilter === subc.id ? 'bold' : '300',
                                marginLeft: '30px',
                              }}
                              value={JSON.stringify(subc)}
                            >
                              {subc.sub_category_name}
                            </option>
                          ))}
                    </select>
                  </div>
                </div>
              </div>
              {category == null && <p>Filter News</p>}
            </div>
            {!archivedFilter && (
              <div className="col-6">
                <button
                  disabled={readNews.length === 0}
                  className={`btn float-right${readNews.length === 0 ? ' greyed' : ''}`}
                  onClick={() => {
                    markAsReadAction(readNews)
                  }}
                >
                  Mark as Read
                </button>
              </div>
            )}
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
                          archivedFilter={archivedFilter}
                          index={index}
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
                          archivedFilter={archivedFilter}
                          key={index}
                          index={index}
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

                {(getUserRoles() == 'PMK Administrator' ||
                  getUserRoles() == 'PMK Content Manager' ||
                  getUserRoles() == 'Technical Administrator') &&
                  !archivedFilter &&
                  !isAnyNewsUnderEdit && (
                    <div
                      className="add_row d-none d-lg-flex"
                      onClick={() => {
                        if (!isAnyNewsUnderEdit) {
                          setNewsUnderEdit(true)
                          setNewsData([...newsData, { id: Math.random() }])
                        } else {
                          toast.error('Please complete the current news entry')
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
            <div className="pagination my-3">
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
                className="btn"
                style={{ display: 'grid', placeItems: 'center' }}
                onClick={() => {
                  setPageNoCall(1)
                  setArchivedFilter(false)
                }}
              >
                Live News
              </button>
            ) : (
              <button
                className="btn"
                style={{ display: 'grid', placeItems: 'center' }}
                onClick={() => {
                  setPageNoCall(1)
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
