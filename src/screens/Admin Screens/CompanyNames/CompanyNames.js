import React, { useState, useEffect } from 'react'
import SecondaryHeading from '../../../components/Secondary Heading'
import API from '../../../utils/api'
import Plusicon from '../../../assets/Group 331.png'
import { toast } from 'react-toastify'
import { Modal, FormControl } from 'react-bootstrap'
import CommonModal from '../../../components/Modals/CommonModal/CommonModal'

import './yokogawa-component.css'
import { useLoading } from '../../../utils/LoadingContext'
import DeleteModal from '../../../components/Modals/Delete Modal/DeleteModal'
import Tooltip from '@mui/material/Tooltip'

export default () => {
  const [companyList, setCompanyList] = useState([])
  const { setLoading } = useLoading()

  // const deleteCompany = id => {
  //   setLoading(true)
  //   API.post('auth/delete_company', {
  //     id: [id],
  //   })
  //     .then(data => {
  //       setLoading(false)

  //       toast.success(data.data.message)
  //       getCompanyList()
  //     })
  //     .catch(error => {
  //       setLoading(false)
  //       console.log(error)
  //     })
  // }

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
    <div className="row mx-2 mx-lg-5 h-100">
      <div className="col user-list-view">
        <SecondaryHeading title={'Company Name'} />
        <div className="col-4 mt-5" style={{ paddingBottom: '5rem' }}>
          <div className="row yk-h-bg py-3">
            <p className="d-flex align-items-center px-3 h6">Company name</p>
          </div>
          {companyList.map(data => (
            <div className="yk-dd row yk-data-row d-flex justify-content-between align-items-center p-3 dropright btn-group">
              <div
                className="dropdown-toggle d-flex justify-content-between flex-fill w-auto"
                data-offset="-15,95"
                data-toggle="dropdown"
              >
                <span className="h6 text-align-center yg-font-capitalize-only">
                  {data.company_name}
                </span>
              </div>
              {/* <div className="d-flex align-items-center"> */}
              {/* <Tooltip title="Delete Company">
                <i
                  className="fa fa-trash w-auto"
                  style={{ fontSize: '1rem' }}
                  aria-hidden="true"
                  onClick={e => {
                    e.stopPropagation()
                    e.preventDefault()
                    setCurrentDeleteId(data.parent_company_id)
                    setDelete(true)
                  }}
                />
              </Tooltip> */}
              {/* <i className="fa fa-caret-right w-auto" data-display="static" aria-hidden="true" /> */}
              {/* </div> */}
              {/* <div
                className="yk-drop-m dropdown-menu"
                style={{ maxHeight: '12rem', overflow: 'auto' }}
              > */}
              {/* {data.company_divisions.map((item, index) => ( */}
              <>
                {/* <a
                      key={index}
                      className="d-flex col justify-content-between align-items-center yg-font-capitalize-only dropdown-item"
                      style={{
                        fontSize: '1rem',
                        padding: '1.17rem',
                        textDecoration: 'none',
                        cursor: 'default',
                      }}
                    > */}
                {/* {item.sub_div_name} */}
                {/* <Tooltip title="Delete Company">
                        <i
                          role={'button'}
                          className="fa fa-trash"
                          aria-hidden="true"
                          style={{ fontSize: '1rem' }}
                          onClick={e => {
                            e.stopPropagation()
                            e.preventDefault()
                            setCurrentDeleteId(item.id)
                            setDelete(true)
                          }}
                        />
                      </Tooltip> */}
                {/* </a> */}
                {/* <hr /> */}
              </>
              {/* ))} */}
              {/* <a
                  className="d-flex justify-content-center align-items-center dropdown-item"
                  style={{ fontSize: '0.8rem', padding: '1.17rem' }}
                >
                  <img
                    src={Plusicon}
                    style={{
                      width: '1rem',
                      marginRight: '0.2rem',
                    }}
                    alt={'PlusIcon'}
                  />
                  Add
                </a> */}
            </div>
            // </div>
          ))}

          {/* <div className="row yk-data-row d-flex justify-content-center align-items-center px-3">
            <div
              className="w-auto"
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
                alt={'PlusIcon1'}
              />
              Add
            </div>
          </div> */}
        </div>
      </div>
      {/* <AddCompany
        show={show}
        setShow={setShow}
        getCompanyList={getCompanyList}
        parentCompnay={parentCompnay}
      /> */}

      {/* <DeleteModal
        setShow={setDelete}
        show={showDelete}
        title={'Are you sure want to delete this Company?'}
        runDelete={deleteCompany}
        saveAndExit={() => setDelete(false)}
        data={currentDeleteId}
        req={'Company'}
      /> */}
    </div>
  )
}

// const AddCompany = ({ show, setShow, getCompanyList, parentCompnay = '' }) => {
//   const [name, setName] = useState('')
//   const { loading, setLoading } = useLoading()

//   const _handleSave = () => {
//     if (name.length < 2) {
//       toast.error('Please provide a company name')
//       return
//     }
//     setLoading(true)
//     setName('')
//     setShow(false)

//     const companyName = parentCompnay !== '' ? parentCompnay : name
//     API.post('auth/add_company', {
//       parent_company: companyName,
//       child_company: companyName === parentCompnay ? name : '',
//     })
//       .then(data => {
//         setLoading(false)
//         toast.success(data.data.message)
//         getCompanyList()
//       })
//       .catch(error => {
//         setLoading(false)
//         console.log(error)
//       })
//   }

//   const handleClose = () => setShow(false)

//   const handleCancel = () => {
//     setName('')
//     setShow(false)
//   }

//   return (
//     <CommonModal
//       show={show}
//       handleClose={handleClose}
//       modalTitle={'Add Company Name'}
//       data={name}
//       handleDataChange={setName}
//       cancelAction={handleCancel}
//       saveAction={_handleSave}
//       placeholder={'Name...'}
//       ariaLabel={"Recipient's username"}
//     />
//   )
// }
