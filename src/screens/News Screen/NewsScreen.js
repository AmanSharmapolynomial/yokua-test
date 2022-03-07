import React, { useEffect, useRef, useState } from 'react'
import NewsItem from '../../components/News Components/NewsItem'
import PrimaryHeading from '../../components/Primary Headings'
import API from '../../utils/api'
import { getUserRoles } from '../../utils/token'
import './style.css'

const NewsScreen = () => {
  const filter1Ref = useRef()
  const filter2Ref = useRef()

  const [showFilterDropdown1, setShowFilterDropdown1] = useState()
  const [showFilterDropdown2, setShowFilterDropdown2] = useState()
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [subCategoryFilter, setSubCategoryFilter] = useState(null)
  const [archivedFilter, setArchivedFilter] = useState(false)

  const [backendData, setBackendData] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [newNews, setNewNews] = useState(false)

  useEffect(async () => {
    setIsLoading(true)

    const payload = {
      category_id: parseInt(categoryFilter),
      sub_category_id: parseInt(subCategoryFilter),
      archived: archivedFilter,
    }

    const getAllNews = await API.post('news/', payload)

    console.log(getAllNews)
    if (getAllNews.status == 200) {
      setBackendData(getAllNews.data)
    }

    setIsLoading(false)
  }, [archivedFilter, categoryFilter, subCategoryFilter])

  const markAsReadAction = array => {
    const payload = {
      news_id: array,
    }
    const markAsRead = API.post('/news/mark_read', payload)
  }

  const saveAndExitAdd = () => {
    setNewNews(false)
  }

  const AddNewCategoryCall = (image, categoryName) => {
    const payload = {
      image,
      data: {
        category_name: categoryName,
      },
    }
    const afterAddMsg = API.post('news/add_category', payload)
    console.log(afterAddMsg)
  }

  const AddNewSubCategoryCall = (categoryName, parentCatId) => {
    const payload = {
      sub_category_name: categoryName,
      parent_category_id: parentCatId,
    }
    const afterAddMsg = API.post('news/add_subcategory', payload)
    console.log(afterAddMsg)
  }

  return (
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
              <i
                className="fa-solid fa-filter has-dropdown"
                onClick={() => {
                  setShowFilterDropdown2(!showFilterDropdown2)
                }}
              />
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
            backendData.news_letters.map(news => {
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
          {backendData?.news_letters.length > 0 ? (
            backendData.news_letters.map((news, index) => (
              <NewsItem
                data={news}
                category={backendData.categories}
                subCategory={backendData.sub_categories}
                key={index}
              />
            ))
          ) : (
            <span> You're all caught up with the News </span>
          )}

          {newNews ? (
            <NewsItem
              data={undefined}
              changeType={'Add'}
              category={backendData.categories}
              subCategory={backendData.sub_categories}
              saveAndExitAdd={saveAndExitAdd}
            />
          ) : (
            <></>
          )}

          {(getUserRoles() == 'PMK Administrator' ||
            getUserRoles() == 'Technical Administrator') && (
            <div
              className="add_row"
              onClick={() => {
                setNewNews(true)
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
  )
}

export default NewsScreen
