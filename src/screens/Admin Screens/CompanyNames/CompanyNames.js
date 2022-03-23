import React, { useState, useEffect } from 'react'
import SecondaryHeading from '../../../components/Secondary Heading'
import API from '../../../utils/api'
import DataTable from 'react-data-table-component'
import Plusicon from '../../../assets/Group 331.png'
import { Dropdown, SplitButton, DropdownButton, ButtonGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'

import './yokogawa-component.css'

export default () => {
  const [companyList, setCompanyList] = useState([])

  const addCompany = (parentCompnay, childCompany) => {
    API.post('auth/add_company', {
      parent_company: parentCompnay,
      child_company: childCompany,
    })
      .then(data => {
        console.log(data)
        getCompanyList()
      })
      .catch(error => {
        console.log(error)
      })
  }

  const deleteCompany = id => {
    API.post('auth/delete_company', {
      id: [id],
    })
      .then(data => {
        console.log(data)
        getCompanyList()
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    getCompanyList()
  }, [])

  const getCompanyList = () => {
    API.get('auth/view_company').then(data => {
      setCompanyList(data.data)
    })
  }

  return (
    <div style={{ padding: '0.5rem 2.5rem', marginBottom: '' }}>
      <SecondaryHeading title={'Company Name'} />

      <div class="col-4 mx-5 mt-5" style={{ paddingBottom: '5rem' }}>
        <div class="row yk-h-bg py-3">
          <p class="d-flex align-items-center px-3 h6">Company name</p>
        </div>
        {companyList.map(data => (
          <div class="yk-dd dropright">
            <div class="row yk-data-row d-flex justify-content-between align-items-center  p-3">
              <div className="h6 text-align-center yg-font-capitalize-only">
                {data.company_name}
              </div>

              <div>
                <div className="d-flex align-items-center">
                  <i
                    className="fa fa-trash"
                    style={{ fontSize: '1rem' }}
                    aria-hidden="true"
                    onClick={() => deleteCompany(data.parent_company_id)}
                  ></i>
                  <i
                    className="fa fa-caret-right dropright dropdown-toggle dropdown-toggle-split"
                    data-toggle="dropdown"
                    aria-expanded="false"
                    style={{ zIndex: 1 }}
                    aria-hidden="true"
                  ></i>
                </div>

                <div class="yk-drop-m dropdown-menu">
                  {data.company_divisions.map(item => (
                    <>
                      {/* row yk-data-row d-flex justify-content-between align-items-center dropdown-toggle p-3 */}
                      <a
                        class="d-flex row justify-content-between align-items-center  yg-font-capitalize-only"
                        style={{ fontSize: '1rem', padding: '1.17rem', marginLeft: '10px' }}
                      >
                        {item.sub_div_name}
                        <i
                          class="fa fa-trash"
                          aria-hidden="true"
                          style={{ fontSize: '1rem' }}
                          onClick={() => deleteCompany(item.id)}
                        ></i>
                      </a>
                      <hr />
                    </>
                  ))}
                  <a
                    class="d-flex justify-content-center align-items-center"
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
          </div>
        ))}

        <div class="row yk-data-row d-flex justify-content-center align-items-center px-3">
          <div style={{ padding: '1.17rem' }}>
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
  )
}
