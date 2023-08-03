import React from 'react'
import { useState, useEffect, useRef } from 'react'
import './style.css'
import { Dropdown, InputGroup, FormControl, Button, Modal, Image } from 'react-bootstrap'
import API from '../../utils/api'
import { toast } from 'react-toastify'

const CustomDropdown = ({
  categories,
  getCompanyList,
  setTopicName,
  getSelectedCompany,
  selectedAddr,
  isProfileEdit = false,
  setComp = null,
}) => {
  const [show, setShow] = useState(false)
  const [currentEdit, setCurrentEdit] = useState(1)
  const [parentCompany, setParentCompany] = useState('')
  const [isTopicAdd, setIsTopicAdd] = useState(false)
  const [isSubTopicAdd, setIsSubTopicAdd] = useState(false)

  const [selectedCompany, setSelectedCompany] = useState(selectedAddr || 'Company')

  useEffect(() => {
    getSelectedCompany(selectedCompany)
  }, [selectedCompany])

  const _saveCompany = (currentEdit, name) => {
    if (name.length < 2) {
      toast.error('Please enter a valid company name')
      setTopicName('')
      return
    }

    let payload = {}
    if (currentEdit === 1) {
      payload = {
        parent_company: name,
        child_company: '',
      }
    } else {
      payload = {
        parent_company: parentCompany,
        child_company: name,
      }
    }

    API.post('auth/add_company', payload)
      .then(data => {
        setSelectedCompany(name)
        getCompanyList()
        setTopicName('')

        setCurrentEdit(1)
        setParentCompany('')
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleChange = cName => {
    setSelectedCompany(cName)
    if (isProfileEdit) {
      setComp(cName)
    }
  }

  return (
    <div className="container">
      <CompanyModal
        saveCompany={(currentEdit, name) => _saveCompany(currentEdit, name)}
        show={show}
        setShow={setShow}
        key={categories.parent_company_id}
        currentEdit={currentEdit}
      />
      <div className="yk-sign-up-dropdn">
        <div className="row">
          <div className="yg-dropdown-overwrtie p-0">
            <div className="btn-group">
              <button className="btn btn-secondary btn-main btn-sm" type="button">
                {selectedCompany}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary btn-arrow dropdown-toggle dropdown-toggle-split"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="sr-only">Toggle Dropdown</span>
              </button>
              <ul className="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu">
                {categories.map(item => (
                  <li className="dropdown-submenu">
                    <a
                      className="dropdown-item"
                      tabIndex="-1"
                      onClick={() => handleChange(item.company_name)}
                    >
                      {item.company_name}
                      {/* <i className="fa fa-chevron-right mt-1" aria-hidden="true" /> */}
                    </a>
                    {item.company_divisions.length > 0 && (
                      <ul className="dropdown-menu">
                        {item.company_divisions.map((subc, index) => (
                          <li
                            className="dropdown-item"
                            onClick={() => handleChange(subc.sub_div_name)}
                          >
                            <a tabIndex="-1">{subc.sub_div_name}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}

                {/* {!isTopicAdd && (
                  <Dropdown.Item
                    className="yg-font-size-r"
                    onClick={() => {
                      setCurrentEdit(1)
                      setShow(true)
                    }}
                  >
                    Others
                  </Dropdown.Item>
                )} */}
                {isTopicAdd && (
                  <InputGroup className="yg-font-size-registrtion p-1 ">
                    <FormControl
                      className="yg-font-size"
                      placeholder="Company"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      value={'topicName'}
                      onChange={e => setTopicName(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        setIsTopicAdd(false)
                        AddNewCompany()
                      }}
                      variant="outline-secondary"
                      className="saveBtn"
                      id="button-addon2"
                    >
                      Save
                    </Button>
                  </InputGroup>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CompanyModal = ({ show, setShow, currentEdit, saveCompany }) => {
  const [companyName, setCompanyname] = useState('')
  const handleClose = () => {
    setCompanyname('')
    setShow(false)
  }

  return (
    <Modal show={show} centered onHide={handleClose}>
      {/* <Modal.Header
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: '0',
        }}
      >
        <Modal.Title>Enter Company Name</Modal.Title>
      </Modal.Header> */}
      <Modal.Body
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          borderBottom: '0',
          fontWeight: 'normal',
        }}
      >
        <div className="row">
          <div className="h4 m-0">Enter Company Name</div>
          <FormControl
            className="yg-font-size my-3 form-control col mx-4"
            placeholder="Name"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            value={companyName}
            onChange={e => setCompanyname(e.target.value)}
          />
          <div className="modal-custom-footer">
            <button
              id="mybtn"
              className="btn btn-background me-4"
              onClick={() => {
                handleClose()
              }}
            >
              Cancel
            </button>
            <button
              className="btn"
              onClick={() => {
                if (companyName.length < 2) {
                  toast.error('Please enter a valid company name')
                  return
                }
                saveCompany(currentEdit, companyName)
                setCompanyname('')
                handleClose()
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal.Body>
      {/* <Modal.Footer
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          borderTop: '0',
        }}
        centered
      >
      </Modal.Footer> */}
    </Modal>
  )
}

export default CustomDropdown
