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
    // <div className="user-approval-screen">
    //   <SecondaryHeading title={'Company Name'} />
    //   <div className="domain-user-list-content">
    //     <div className="domain-list-content " style={{ border: '2px solid black' }}>
    //       <div
    //         style={{
    //           justifyContent: 'space-between',
    //           display: 'flex',
    //           flexDirection: 'row',
    //           marginBottom: '10px',
    //           backgroundColor: 'var(--bgColor2)',
    //           padding: '15px 15px',
    //         }}
    //       >
    //         <span style={{ color: 'white' }}>{'Company name'}</span>
    //         <div></div>
    //       </div>
    //       {companyList.map(data => {
    //         return (
    //           <div
    //             style={{
    //               justifyContent: 'space-between',
    //               display: 'flex',
    //               flexDirection: 'row',
    //               marginBottom: '10px',
    //               padding: '5px 0px 5px 15px',
    //               borderBottom: '2px solid black',
    //             }}
    //           >
    //             <span>{data.company_name}</span>
    //             <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
    //               <i
    //                 className="fa-solid fa-trash mr-2"
    //                 style={{
    //                   cursor: 'pointer',
    //                   color: '#CD2727',
    //                 }}
    //                 onClick={() => {
    //                   // admin/delete_whitelisted_domain
    //                 }}
    //               />
    //               <i class="fa-solid fa-caret-right"></i>
    //               <DropdownButton 

    //                 style={{ marginRight: '10px', }}
    //                 key={'end'}
    //                 id={`dropdown-button-drop-start`}
    //                 drop={'end'}
    //                 variant="secondary"

    //               >

    //                 {data.company_divisions.map(div => (
    //                   <>
    //                     <Dropdown.Item eventKey="1" style={{border:'1px solid #000'}}>{div.sub_div_name}</Dropdown.Item>
    //                     <Dropdown.Divider />
    //                   </>
    //                 ))}
    //                 <Dropdown.Item eventKey="4">
    //                   <div
    //                     style={{
    //                       display: 'flex',
    //                       alignItems: 'center',
    //                       justifyContent: 'center',
    //                     }}
    //                     onClick={() => {
    //                       // OPEN COMPONENT
    //                     }}
    //                   >
    //                     <img
    //                       src={Plusicon}
    //                       style={{
    //                         width: '22px',
    //                       }}
    //                       className={'mr-2'}
    //                     />
    //                     {'Add'}
    //                   </div>
    //                 </Dropdown.Item>
    //               </DropdownButton>
    //             </div>
    //           </div>
    //         )
    //       })}
    //       <div
    //         className="add_row"
    //         onClick={() => {
    //           // OPEN COMPONENT
    //         }}
    //       >
    //         <img
    //           src={Plusicon}
    //           style={{
    //             width: '22px',
    //           }}
    //           className={'mr-2'}
    //         />
    //         {'Add'}
    //       </div>
    //     </div>
    //   </div>
    // </div>





    <div class="container company-table m-4">
      <div class="row yk-h-bg">
        <p class="d-flex align-items-center px-3 mb-0">Company name</p>
      </div>
      <div class="yk-dd dropright">
        <div class="row yk-data-row d-flex justify-content-between align-items-center dropdown-toggle px-3" data-toggle="dropdown">
          <div>YA</div>

          <div class="">
            <div>
              <i class="fa fa-trash" aria-hidden="true"></i>
              <i class="fa fa-caret-right" aria-hidden="true"></i>
            </div>
            <div class="yk-drop-m dropdown-menu">
              <a class="d-flex justify-content-between align-items-center">abc<i class="fa fa-trash" aria-hidden="true"></i></a><br />
              <hr />
              <a class="d-flex justify-content-between align-items-center">abc<i class="fa fa-trash" aria-hidden="true"></i></a><br />
              <hr />
              <a class="d-flex justify-content-between align-items-center">abc<i class="fa fa-trash" aria-hidden="true"></i></a><br />
              <hr />
              <a class="d-flex justify-content-between align-items-center">abc<i class="fa fa-trash" aria-hidden="true"></i></a><br />
              <hr/>
              <a class="d-flex justify-content-center align-items-center"><img
                  src={Plusicon}
                  style={{
                    width: '22px',
                    marginRight: '12px',
                  }}
                />Add</a><br />
            </div>
          </div>
        </div>
      </div>




      <div class="row yk-data-row d-flex justify-content-center align-items-center px-3 py-2">
        <div><img
                  src={Plusicon}
                  style={{
                    width: '22px',
                    marginRight: '12px',
                  }}
                />Add</div>
      </div>

    </div>


  )
}
