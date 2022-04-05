import React, { useEffect, useRef, useState } from 'react'
import Header from '../../components/Header'
import API from '../../utils/api'
import { getToken, getUserRoles } from '../../utils/token'
import './style.css'
import { useLoading } from '../../utils/LoadingContext'
import { useNavigate } from 'react-router'
import { useLocation } from 'react-router-dom'
import Table from '../../components/TableComponent/Table'
import { Modal } from 'react-bootstrap'

const ProductDetail = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { setLoading } = useLoading()
  const [archivedFilter, setArchivedFilter] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddComponentModalVisible, setIsAddComponentModalVisible] = useState(false)
  const [productDetail, setProductDetail] = useState([])

  const components = [
    {
      title: 'Add Table',
      content: [
        { label: 'Table Name', type: 'input' },
        { label: 'Add Number of Columns', type: 'input' },
      ],
    },
    { title: 'Link' },
    { title: 'Binary' },
    { title: 'Description' },
    { title: 'Image' },
  ]

  const columneNames = ['Column Name', 'Sort', 'Date', 'Link', 'Filter']

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
      return (
        <Table
          tableObject={ele.table_data}
          setShowDeleteModal={false}
          onRefresh={() => {
            getProductDetails()
          }}
        />
      )
    }
  }

  const renderComponents = () =>
    productDetail.map((item, index) => (
      <div className="col-12 mt-5">
        <div className="row">
          <span className="text-bold">{item.sectionName}</span>
        </div>
        <div className="row">{item.components.map((ele, idx) => renderType(ele))}</div>
        <div className="row mt-3">
          <button
            class="btn create-domain-btn"
            onClick={() => {
              setIsAddComponentModalVisible(true)
            }}
          >
            Add Component
          </button>
        </div>
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
      <div className="row mx-2 mx-md-5 h-100">
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
      <Modal
        show={isAddComponentModalVisible}
        centered
        onHide={() => {
          setIsAddComponentModalVisible(false)
        }}
      >
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
          }}
        >
          <Modal.Title>List of Components</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div class="accordion" id="accordionExample">
            {components.map((item, idx) => (
              <div class="card">
                <div class="card-header" id="headingOne">
                  <div
                    className="accordian-title d-flex justify-content-between align-items-center font-8"
                    type="button"
                    data-toggle="collapse"
                    data-target={`#collapse${idx}`}
                    aria-expanded="false"
                    aria-controls={`collapse${idx}`}
                  >
                    <span>{item.title}</span>
                    <i className="fa-solid fa-angle-right greyed" />
                  </div>
                </div>
                <div
                  id={`collapse${idx}`}
                  class="collapse hide"
                  aria-labelledby="headingOne"
                  data-parent="#accordionExample"
                >
                  <div class="card-body">
                    {item?.content?.map(contentItem => {
                      if (contentItem.type === 'input') {
                        return (
                          <div className="row">
                            <div className="input-group mb-3">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text font-8 font-weight-bold"
                                  id="basic-addon1"
                                >
                                  {contentItem.label}
                                </span>
                              </div>
                              <input
                                type="number"
                                min={0}
                                max={10}
                                className="form-control"
                                aria-label={contentItem.label}
                                aria-describedby="basic-addon1"
                              />
                              <div className="row">
                                {columneNames.map((item, index) => (
                                  <div className=""></div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      } else {
                        return null
                      }
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        {/* <Modal.Footer
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderTop: '0',
          }}
          centered
        >
          <button id="mybtn" className="btn btn-background mr-4" onClick={() => {}}>
            Cancel
          </button>
          <button className="btn" onClick={() => {}}>
            Confirm
          </button>
        </Modal.Footer> */}
      </Modal>
    </>
  )
}

export default ProductDetail
