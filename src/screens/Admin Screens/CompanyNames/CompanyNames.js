import React, { useState, useEffect } from 'react'
import SecondaryHeading from '../../../components/Secondary Heading'
import API from '../../../utils/api'
import DataTable from 'react-data-table-component'
import Plusicon from '../../../assets/Group 331.png'
import { Dropdown, SplitButton, DropdownButton, ButtonGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { Modal, FormControl } from 'react-bootstrap'

import './yokogawa-component.css'
import { useLoading } from '../../../utils/LoadingContext'
import DeleteModal from '../../../components/Modals/Delete Modal/DeleteModal'

export default () => {
  const [companyList, setCompanyList] = useState([])
  const { loading, setLoading } = useLoading()

  const deleteCompany = id => {
    setLoading(true)
    API.post('auth/delete_company', {
      id: [id],
    })
      .then(data => {
        setLoading(false)

        toast.success(data.data.message)
        getCompanyList()
      })
      .catch(error => {
        setLoading(false)
        console.log(error)
      })
  }

  useEffect(() => {
    getCompanyList()
  }, [])

  const getCompanyList = () => {
    setLoading(true)

    API.get('auth/view_company').then(data => {
      setCompanyList(data.data)
      setLoading(false)
    })
  }

  const [show, setShow] = useState(false)
  const [parentCompnay, setParentCompany] = useState('')
  const [showDelete, setDelete] = useState(false)
  const [currentDeleteId, setCurrentDeleteId] = useState(0)
  return (
    <div className="row mx-2 mx-md-5 h-100">
      <div className="col user-list-view">
        <SecondaryHeading title={'Company Name'} />
        <div className="col-4 mt-5" style={{ paddingBottom: '5rem' }}>
          <div className="row yk-h-bg py-3">
            <p className="d-flex align-items-center px-3 h6">Company name</p>
          </div>
          {companyList.map(data => (
            <div className="yk-dd">
              <div className="row yk-data-row d-flex justify-content-between align-items-center p-3 dropright btn-group">
                <div
                  className="dropdown-toggle col-12 d-flex justify-content-between w-100"
                  data-toggle="dropdown"
                >
                  <div className="h6 text-align-center yg-font-capitalize-only">
                    {data.company_name}
                  </div>
                  <div className="d-flex align-items-center">
                    <i
                      className="fa fa-trash"
                      style={{ fontSize: '1rem' }}
                      aria-hidden="true"
                      onClick={e => {
                        console.log('GHIWGWLHLNJNJLK')
                        e.stopPropagation()
                        e.preventDefault()
                        setCurrentDeleteId(data.parent_company_id)
                        setDelete(true)
                      }}
                    ></i>
                    {/* <i
                    className="fa fa-caret-right dropdown-toggle" data-toggle="dropdown" aria-hidden="true"
                  ></i> */}
                    <i className="fa fa-caret-right" data-display="static" aria-hidden="true"></i>
                  </div>
                </div>
                <div className="yk-drop-m dropdown-menu">
                  {data.company_divisions.map((item, index) => (
                    <>
                      <a
                        key={index}
                        className="d-flex col justify-content-between align-items-center yg-font-capitalize-only dropdown-item"
                        style={{
                          fontSize: '1rem',
                          padding: '1.17rem',
                          textDecoration: 'none',
                          cursor: 'default',
                        }}
                      >
                        {item.sub_div_name}
                        <i
                          role={'button'}
                          className="fa fa-trash"
                          aria-hidden="true"
                          style={{ fontSize: '1rem' }}
                          onClick={e => {
                            e.stopPropagation()
                            e.preventDefault()
                            setCurrentDeleteId(data.parent_company_id)
                            setDelete(true)
                          }}
                        ></i>
                      </a>
                      <hr />
                    </>
                  ))}
                  <a
                    onClick={e => {
                      setShow(true)
                      setParentCompany(data.company_name)
                    }}
                    className="d-flex justify-content-center align-items-center dropdown-item"
                    style={{ fontSize: '0.8rem', padding: '1.17rem' }}
                  >
                    <img
                      src={Plusicon}
                      style={{
                        width: '1rem',
                        marginRight: '0.2rem',
                      }}
                    />
                    Add
                  </a>
                </div>
              </div>
            </div>
          ))}

          <div className="row yk-data-row d-flex justify-content-center align-items-center px-3">
            <div
              style={{ padding: '1.17rem' }}
              onClick={() => {
                setShow(true)
                setParentCompany('')
              }}
            >
              <img
                src={Plusicon}
                style={{
                  width: '1rem',
                  marginRight: '0.2rem',
                }}
              />
              Add
            </div>
          </div>
        </div>
      </div>
      <AddCompany
        show={show}
        setShow={setShow}
        getCompanyList={getCompanyList}
        parentCompnay={parentCompnay}
      />

      <DeleteModal
        setShow={setDelete}
        show={showDelete}
        title={'Are you sure want to delete this Company?'}
        runDelete={deleteCompany}
        saveAndExit={() => setDelete(false)}
        data={currentDeleteId}
        req={'Company'}
      />
    </div>
  )
}

const AddCompany = ({ show, setShow, getCompanyList, parentCompnay = '' }) => {
  const [name, setName] = useState('')
  const { loading, setLoading } = useLoading()

  const _handleSave = () => {
    if (name.length < 2) {
      toast.error('Please provide company name')
      return
    }
    setLoading(true)
    setName('')
    setShow(false)

    const companyName = parentCompnay != '' ? parentCompnay : name
    API.post('auth/add_company', {
      parent_company: companyName,
      child_company: companyName == parentCompnay ? name : '',
    })
      .then(data => {
        setLoading(false)
        toast.success(data.data.message)
        getCompanyList()
      })
      .catch(error => {
        setLoading(false)
        console.log(error)
      })
  }

  const handleClose = () => setShow(false)

  return (
    <>
      <Modal show={show} centered onHide={handleClose}>
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
          }}
        >
          <Modal.Title>Add Company Name</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
            width: '100%',
          }}
        >
          <FormControl
            style={{ fontSize: 'small' }}
            className="mt-2 mb-2"
            placeholder="Name.."
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderTop: '0',
          }}
          centered
        >
          <button
            id="mybtn"
            className="btn btn-background mr-4"
            onClick={() => {
              setName('')
              setShow(false)
            }}
          >
            Cancel
          </button>
          <button
            className="btn"
            onClick={() => {
              _handleSave()
            }}
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
