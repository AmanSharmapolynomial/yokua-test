import React, { useEffect, useRef, useState } from 'react'
import Header from '../../components/Header'
import API from '../../utils/api'
import { getToken, getUserRoles } from '../../utils/token'
import './style.css'
import { useLoading } from '../../utils/LoadingContext'
import { useNavigate, useParams } from 'react-router'
import { useLocation } from 'react-router-dom'
import Table from '../../components/TableComponent/Table'
import { Modal, Image } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import DeleteModal from '../../components/Modals/Delete Modal/DeleteModal'
import ic_link from '../../assets/link_icon.png'
import PrimaryHeading from '../../components/Primary Headings'
const Search = props => {
  const isAdmin =
    getUserRoles() == 'Technical Administrator' ||
    getUserRoles() == 'PMK Administrator' ||
    getUserRoles() == 'PMK Content Manager'

  const navigate = useNavigate()
  const { query } = useParams()
  const { state } = useLocation()
  const { setLoading } = useLoading()
  const [searchResults, setSearchResults] = useState([])
  const [expanded, setExpanded] = useState(-1)
  const [isHistory, setIsHistory] = useState(false)

  const getSearchResults = () => {
    setLoading(true)
    API.post('/search/', {
      query: query,
      search_history: isHistory,
    })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          setSearchResults(res.data.response)
        }
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  const renderType = (ele, idx, arr, section) => {
    if (ele.type === 'binary') {
      return (
        <div className="col-12 mt-4">
          <div className="row">
            {/* <span className="flex-fill">{ele.title}</span> */}
            <a
              className="bordered-btn rounded w-auto"
              role={'button'}
              href={ele.binary_link}
              download
            >
              Download
            </a>
          </div>
        </div>
      )
    } else if (ele.type === 'table') {
      return (
        <Table
          onEditableClick={() => {}}
          table_name={ele.table_name}
          onLinkClick={() => {}}
          onDeleteComponent={() => {}}
          tableObject={ele.table_data}
          setShowDeleteModal={false}
          onRefresh={() => {}}
          isTableEditable={false}
          isAdmin={false}
          onTableUpdate={tableObject => {}}
        />
      )
    } else if (ele.type === 'link') {
      return (
        <div className="col-12 mt-4">
          <div className="row">
            {/* <span className="flex-fill">{ele.title}</span> */}
            <a role={'button'} href={ele.link} target="_blank" className="w-auto p-0">
              {ele.title}
            </a>
          </div>
        </div>
      )
    } else if (ele.type === 'description') {
      return (
        <div className="col-12 mt-4">
          <div className="row">{ele.description}</div>
        </div>
      )
    } else if (ele.type === 'image') {
      if (arr[idx - 1]?.type !== 'image') {
        let IMAGES = []
        for (let index = idx; index < arr.length; index++) {
          const element = arr[index]
          if (element.type === 'image') {
            IMAGES.push(
              <div className={`col-6${index === idx ? ' ps-0' : ''}`}>
                <Image src={ele.image_link} className="border rounded img-product-line" />
              </div>
            )
          } else {
            break
          }
        }
        return (
          <div className="col-12 mt-4">
            <div className="row">{IMAGES}</div>
          </div>
        )
      } else {
        return null
      }
    } else if (ele.type === 'image_grid') {
      let IMAGES = []
      for (let index = 0; index < ele.images.length; index++) {
        const element = ele.images[index]
        IMAGES.push(
          <div className={`col-3${index === 0 ? ' ps-0' : ''}`}>
            <Image src={element.image_link} className="border rounded img-product-line" />
          </div>
        )
      }
      return (
        <div className="col-12 mt-4">
          <div className="row">{IMAGES}</div>
        </div>
      )
    }
  }

  const renderComponents = () => (
    <div className="accordion" id="accordion" style={{ width: '100%' }}>
      {searchResults.map((item, index) => (
        <div className="mt-5">
          <div className="row">
            <div
              data-toggle="collapse"
              data-target={`#collapse${index}`}
              aria-expanded="true"
              aria-controls={`collapse${index}`}
              className="btn-group border rounded-right w-auto p-0" /*collapsed*/
              role={'button'}
              onClick={() => {
                if (index === expanded) setExpanded(-1)
                else setExpanded(index)
              }}
            >
              <span className="text-bold px-4">{item.category}</span>
              <div style={{ width: '1px', background: 'lightgrey', height: '100%' }} />
              <button
                ref={element => {
                  if (element) {
                    element.style.setProperty('background-color', 'white', 'important')
                  }
                }}
                className=""
                style={{ borderColor: 'none', border: 'none', color: 'black' }}
              >
                <i
                  className={`fa-solid ${
                    index !== expanded ? 'fa-angle-down' : 'fa-angle-up'
                  } mx-2`}
                  style={{ fontSize: '1rem' }}
                />
              </button>
            </div>
          </div>
          <div
            id={`collapse${index}`}
            className="row collapse show"
            aria-labelledby="headingTwo"
            // data-parent={`#accordion`}
          >
            {item.data.map((ele, idx, arr) => renderType(ele, idx, arr, item))}
          </div>
        </div>
      ))}
    </div>
  )

  useEffect(() => {
    setIsHistory(false)
    getSearchResults()
  }, [query])

  useEffect(() => {
    getSearchResults()
  }, [isHistory])

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
          <PrimaryHeading title={'Search Results'} />
          <div className="col">
            <div className="row">
              <div className="col-12 col-md-auto border rounded px-3 py-2 mt-3 search-header-container">
                Search results for "{query}"
              </div>
            </div>
            <div className="row">{renderComponents()}</div>
            <div className="row mt-3">
              <button
                className="btn create-domain-btn w-auto mx-auto"
                onClick={() => {
                  setIsHistory(true)
                }}
              >
                Result from history
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Search
