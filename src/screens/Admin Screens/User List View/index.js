import React, { useEffect, useRef, useState } from 'react'
import SecondaryHeading from '../../../components/Secondary Heading'
import DataTable from 'react-data-table-component'
import { Pagination } from 'antd'
import Dropdown from '../../../components/Dropdown'
import UserDetailsModal from '../../../components/Modals/User Detail Modal'
import API from '../../../utils/api'
import { toast } from 'react-toastify'
import { getUserRoles } from '../../../utils/token'
import DeleteModal from '../../../components/Modals/Delete Modal/DeleteModal'
import Plusicon from '../../../assets/Group 331.png'
import Filtermg from '../../../assets/Icon awesome-filter.png'
import { useLoading } from '../../../utils/LoadingContext'

const NEW_TO_OLD = 'latest'
const OLD_TO_NEW = 'old'
const A_TO_Z = 'ascending'
const Z_TO_A = 'descending'

const nto = 'New to Old'
const otn = 'Old to New'
const atz = 'A to Z Company'
const zta = 'Z to A Company'

const UserListView = () => {
  const { setLoading } = useLoading()

  // states
  const [openModal, setOpenModal] = useState(false)
  const [modelTitle, setModalTitle] = useState('View User')
  const [changeModal, setChangeModal] = useState('')
  const [filterCheckboxPMK, setFilterCheckboxPMK] = useState(true)
  const [filterCheckboxCM, setFilterCheckboxCM] = useState(true)
  const [filterCheckboxUser, setFilterCheckboxUser] = useState(true)
  const [filterActive, setFilterActive] = useState('')

  const [selectedRowsState, setSelectedRowsState] = useState([])
  const dropdownData = ['PMK Administrator', 'PMK Content Manager', 'User']
  const customeSortDown = [
    {
      key: NEW_TO_OLD,
      value: nto,
    },
    {
      key: OLD_TO_NEW,
      value: otn,
    },
    {
      key: A_TO_Z,
      value: atz,
    },
    {
      key: Z_TO_A,
      value: zta,
    },
  ]
  const [showSortDropDown, setShowDropDown] = useState(false)

  const filter1Ref = useRef()
  const filter2Ref = useRef()
  const filter3Ref = useRef()
  const filter4Ref = useRef()
  const filterFromCheckbox1Ref = useRef()
  const filterFromCheckbox2Ref = useRef()
  const filterFromCheckbox3Ref = useRef()

  // // data from backedn to be stored here
  const [backendData, setBackendData] = useState([])
  const [dataToChange, setDataToChange] = useState(null)

  // refs
  let [contentRow, setContentRow] = useState([])
  const [reloadTable, setReloadTable] = useState(false)

  const [openBasicDeleteModal, setOpenBasicDeleteModal] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState('')
  const [sortMethod, setSortMethod] = useState({
    key: NEW_TO_OLD,
    value: nto,
  })
  const [pageNoCall, setPageNoCall] = useState(1)
  const [totalPages, setTotalPages] = useState()

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      minWidth: '10rem',
    },
    {
      name: 'Role',
      selector: row => row.role,
      minWidth: '15rem',
    },
    {
      name: 'E-Mail ID',
      selector: row => row.companyEmail,
      grow: 2,
      minWidth: '15rem',
    },
    {
      name: 'Company',
      selector: row => row.company,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    },
    {
      name: '',
      selector: row => row.edit,
      width: '80px',
    },
    {
      name: (
        <div className="dropdown">
          <img
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            style={{ width: '14px', height: '14px' }}
            className="dropdown-toggle"
            src={require('../../../assets/Rearrange order.png')}
          />

          <div className="dropdown-menu">
            {customeSortDown.map((element, index) => (
              <span
                style={{
                  color: 'rgba(0,0,0,0.87)',
                  fontWeight: element.key === sortMethod.key ? '600' : '400',
                }}
                key={index}
                className="dropdown-item filter-item"
                onClick={() => {
                  setSortMethod(element)
                  setShowDropDown(false)
                  // _handleSort(element);
                }}
              >
                {element.value}
              </span>
            ))}
          </div>
        </div>
      ),
    },
  ]

  useEffect(() => {
    filterFromCheckbox1Ref.current.checked = true
    filterFromCheckbox2Ref.current.checked = true
    filterFromCheckbox3Ref.current.checked = true
  }, [])

  const _handleSort = () => {
    setLoading(true)
    const updatedUserList = backendData
    let sortedArray = []
    if (sortMethod === NEW_TO_OLD) {
      sortedArray = updatedUserList.sort((a, b) =>
        new Date(a.date_joined) > new Date(b.date_joined) ? 1 : -1
      )
    } else if (sortMethod === OLD_TO_NEW) {
      sortedArray = updatedUserList.sort((a, b) =>
        new Date(a.date_joined) < new Date(b.date_joined) ? 1 : -1
      )
    } else if (sortMethod === A_TO_Z) {
      sortedArray = updatedUserList.sort((a, b) =>
        a.first_name.toLowerCase() > b.first_name.toLowerCase() ? 1 : -1
      )
    } else if (sortMethod === Z_TO_A) {
      sortedArray = updatedUserList.sort((a, b) =>
        a.first_name.toLowerCase() < b.first_name.toLowerCase() ? 1 : -1
      )
    } else {
      toast.error('No filters found')
      return
    }
    if (sortedArray.length > 0) {
      setBackendData(p => [...sortedArray])
      toast.success('Filters applied')
    } else {
    }
    setLoading(false)
  }

  const customSort = (rows, selector, direction) => {
    return rows.sort((a, b) => {
      // use the selector to resolve your field names by passing the sort comparitors
      const aField = selector(a).toLowerCase()
      const bField = selector(b).toLowerCase()

      let comparison = 0

      if (aField > bField) {
        comparison = 1
      } else if (aField < bField) {
        comparison = -1
      }
      return direction === 'desc' ? comparison * -1 : comparison
    })
  }

  useEffect(async () => {
    const payload = {
      pmk_admin: filterCheckboxPMK,
      content_manager: filterCheckboxCM,
      user: filterCheckboxUser,
      filter: filterActive,
      page_index: pageNoCall,
      sort_by: sortMethod.key,
    }
    _getUserList(payload)
  }, [reloadTable, filterActive, pageNoCall, sortMethod])

  const _getUserList = async payload => {
    setLoading(true)

    const listuserdata = await API.post('admin/list_users', payload)
    setLoading(false)
    const updatedUserList = listuserdata.data?.page_data
    let sortedArray = updatedUserList

    setTotalPages(listuserdata.data.total_pages)
    const contentRowData = []
    sortedArray.map((data, index) => {
      contentRowData.push({
        name: (
          <span
            style={{
              cursor: 'pointer',
            }}
            onClick={() => {
              setChangeModal('View')
              setOpenModal(true)
              setModalTitle('View user detail')
              // document.body.style.overflow = 'hidden'
              setDataToChange(index)
            }}
          >
            {data.first_name + ' ' + data.last_name}
          </span>
        ),
        id: index,
        role: (
          <Dropdown
            value={data.role}
            data={dropdownData}
            addOrEditUser={payload => {
              addOrEditUser('Edit', payload, index)
            }}
            userData={data}
          />
        ),
        companyEmail: data.email,
        status: data.status,
        company: data.company_name,
        edit: (getUserRoles() === 'PMK Administrator' ||
          getUserRoles() === 'Technical Administrator') && (
          <div className="edit-icons" key={index}>
            <i
              className="fa-solid fa-pen-to-square mx-2"
              data={dropdownData}
              style={{
                color: 'var(--bgColor2)',
              }}
              onClick={() => {
                setChangeModal('Edit')
                setOpenModal(true)
                setModalTitle('Update user detail')

                // document.documentElement.scrollTop = 0
                // document.body.style.overflow = 'hidden'
                setDataToChange(index)
              }}
            />
            <i
              className="fa-solid fa-trash mx-2"
              style={{
                color: '#CD2727',
              }}
              onClick={() => {
                // delete single user
                setDeleteEmail(data.email)
                setOpenBasicDeleteModal(true)
              }}
            />
          </div>
        ),
      })
    })

    setBackendData(sortedArray)
    setContentRow(contentRowData)
    setLoading(false)
  }

  const conditionalRowStyles = [
    {
      when: row => row.id % 2 !== 0,
      style: {},
    },
  ]
  const customStyles = {
    rows: {
      style: {},
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
        backgroundColor: 'var(--bgColor2)',
        color: 'white',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',

        fontSize: '0.8rem',
      },
    },
  }

  // Useful Functions to manage Users from Table

  const saveAndExitModal = (change, data) => {
    if (data?.email && data) {
      addOrEditUser(change, data)
      setOpenModal(false)
    } else {
      setOpenModal(false)
    }
    setOpenBasicDeleteModal(false)
    // document.body.style.overflow = 'auto'
  }

  const selectedRowsAction = ({ selectedRows }) => {
    // do anything with selected rows
    console.log('do anything with', selectedRows)
    setSelectedRowsState(selectedRows)
  }

  const deleteUser = async () => {
    // write delete user api call here
    if (selectedRowsState.length > 0) {
      const deleteUserEmails = []
      console.log(selectedRowsState)
      selectedRowsState.map((row, index) => {
        deleteUserEmails.push(row.companyEmail)
      })
      const payload = {
        email: deleteUserEmails,
      }
      console.log(payload)
      const afterDeleteMsg = await API.post('admin/delete_user', payload)
      setPageNoCall(1)
      console.log(afterDeleteMsg)
    }
    console.log('deleted Selected Users', selectedRowsState)
  }

  const deleteSingleUser = async userEmail => {
    const payload = {
      email: [userEmail],
    }
    const afterDeleteMsg = await API.post('admin/delete_user', payload)
    toast.success(afterDeleteMsg.data.message)
    setReloadTable(!reloadTable)
    setPageNoCall(1)
  }

  const addOrEditUser = async (type, data, idx) => {
    let index
    let payload = {
      email_id: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      role: data.role,
      password: data.password,
      company_name: data.company_name,
    }
    if (idx === undefined || idx === null) {
      index = dataToChange
      console.log(dataToChange, 390)
    } else {
      if (pageNoCall > 1) index = idx + pageNoCall * 10
      else index = idx
    }
    console.log(type, data, idx, contentRow[index]?.companyEmail)
    if (type === 'Edit' && contentRow[index]?.companyEmail) {
      payload = {
        ...payload,
        email_id: contentRow[index].companyEmail,
      }
      if (data.email !== contentRow[index].companyEmail) {
        payload = { ...payload, new_email: data.email }
      }
    }

    if (payload.email_id !== '') {
      const afterAddOrDeleteMsg = await API.post(
        type === 'Edit' ? 'admin/edit_user' : 'admin/add_user',
        payload
      )

      if (data.imageFile && data.imageFile !== backendData[index].avatar_link) {
        const formData = new FormData()

        formData.append('image', data.imageFile)
        formData.append('email', data.email)
        await API.post('auth/update_avatar', formData)
          .then(data => {
            setReloadTable(!reloadTable)
          })
          .catch(error => {
            // toast.error('Error while updating Avatar')
          })
      } else {
        setReloadTable(!reloadTable)
      }
      setDataToChange()
      toast.success(afterAddOrDeleteMsg.data.message)
    } else {
      toast.error('Enter E-Mail')
    }
    setReloadTable(!reloadTable)
  }

  // filters
  const filterTable = value => {
    setFilterActive(value)
  }
  function onChange(pageNumber) {
    setPageNoCall(pageNumber)
  }

  return (
    <>
      <div className="row mx-2 mx-lg-5 h-100">
        <div className="col user-list-view">
          <SecondaryHeading title={'Users list view'} />

          <div className="col filter-actions">
            <div className="filter-icons">
              <div className="dropdown">
                <img
                  data-spy="affix"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  className={
                    filterActive === ''
                      ? 'dropdown-toggle greyed filter-icon'
                      : 'dropdown-toggle filter-icon'
                  }
                  src={Filtermg}
                />

                <div
                  className="dropdown-menu"
                  style={{
                    overflowY: 'auto',
                    maxHeight: '10rem',
                  }}
                >
                  <span
                    className="dropdown-item"
                    ref={filter1Ref}
                    onClick={() => {
                      if (filterActive == 'active') {
                        setPageNoCall(1)
                        filterTable('')
                        filter1Ref.current.style.fontWeight = '300'
                      } else {
                        setPageNoCall(1)
                        filterTable('active')
                        filter1Ref.current.style.fontWeight = 'bold'
                        filter2Ref.current.style.fontWeight = '300'
                        filter3Ref.current.style.fontWeight = '300'
                        filter4Ref.current.style.fontWeight = '300'
                      }
                    }}
                  >
                    Active
                  </span>
                  <span
                    className="dropdown-item"
                    ref={filter2Ref}
                    onClick={() => {
                      if (filterActive == 'inactive') {
                        setPageNoCall(1)
                        filterTable('')
                        filter2Ref.current.style.fontWeight = '300'
                      } else {
                        setPageNoCall(1)
                        filterTable('inactive')
                        filter2Ref.current.style.fontWeight = 'bold'
                        filter1Ref.current.style.fontWeight = '300'
                        filter3Ref.current.style.fontWeight = '300'
                        filter4Ref.current.style.fontWeight = '300'
                      }
                    }}
                  >
                    Inactive
                  </span>
                  <span
                    className="dropdown-item"
                    ref={filter3Ref}
                    onClick={() => {
                      if (filterActive == 'internal') {
                        setPageNoCall(1)
                        filterTable('')
                        filter3Ref.current.style.fontWeight = '300'
                      } else {
                        setPageNoCall(1)
                        filterTable('internal')
                        filter3Ref.current.style.fontWeight = 'bold'
                        filter1Ref.current.style.fontWeight = '300'
                        filter2Ref.current.style.fontWeight = '300'
                        filter4Ref.current.style.fontWeight = '300'
                      }
                    }}
                  >
                    Internal User
                  </span>
                  <span
                    className="dropdown-item"
                    ref={filter4Ref}
                    onClick={() => {
                      if (filterActive == 'external') {
                        setPageNoCall(1)
                        filterTable('')
                        filter4Ref.current.style.fontWeight = '300'
                      } else {
                        setPageNoCall(1)
                        filterTable('external')
                        filter4Ref.current.style.fontWeight = 'bold'
                        filter1Ref.current.style.fontWeight = '300'
                        filter2Ref.current.style.fontWeight = '300'
                        filter3Ref.current.style.fontWeight = '300'
                      }
                    }}
                  >
                    External User
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-auto filter-checkbox d-flex align-items-center">
                <input
                  className="w-auto me-2"
                  type="checkbox"
                  ref={filterFromCheckbox1Ref}
                  value="PMK Administrator"
                  onChange={e => {
                    if (e.target.checked) {
                      setPageNoCall(1)
                      setFilterCheckboxPMK(true)
                      setReloadTable(!reloadTable)
                    } else {
                      setPageNoCall(1)
                      setFilterCheckboxPMK(false)
                      setReloadTable(!reloadTable)
                    }
                  }}
                />
                PMK Administrator
              </div>
              <div className="col-auto filter-checkbox d-flex align-items-center">
                <input
                  className="w-auto me-2"
                  type="checkbox"
                  ref={filterFromCheckbox2Ref}
                  value="Content Manager"
                  onChange={e => {
                    if (e.target.checked) {
                      setPageNoCall(1)
                      setFilterCheckboxCM(true)
                      setReloadTable(!reloadTable)
                    } else {
                      setPageNoCall(1)
                      setFilterCheckboxCM(false)
                      setReloadTable(!reloadTable)
                    }
                  }}
                />
                Content Manager
              </div>
              <div className="col-auto filter-checkbox d-flex align-items-center">
                <input
                  className="w-auto me-2"
                  type="checkbox"
                  ref={filterFromCheckbox3Ref}
                  value="User"
                  onChange={e => {
                    if (e.target.checked) {
                      setPageNoCall(1)
                      setFilterCheckboxUser(true)
                      setReloadTable(!reloadTable)
                    } else {
                      setPageNoCall(1)
                      setFilterCheckboxUser(false)
                      setReloadTable(!reloadTable)
                    }
                  }}
                />
                User
              </div>
            </div>
          </div>
          <div className="user-list-view-table mt-3">
            <DataTable
              sortIcon={<i className="fa-solid fa-sort ms-1"></i>}
              columns={columns}
              data={contentRow}
              selectableRows
              customStyles={customStyles}
              conditionalRowStyles={conditionalRowStyles}
              onSelectedRowsChange={selectedRowsAction}
              sortFunction={customSort}
            />
          </div>
          {(getUserRoles() === 'PMK Administrator' ||
            getUserRoles() === 'Technical Administrator') && (
            <div
              className="add_row"
              style={{ fontSize: '1rem', background: 'none' }}
              onClick={() => {
                // document.documentElement.scrollTop = 0
                // document.body.style.overflow = 'hidden'
                setChangeModal('Add')
                setOpenModal(true)
                setModalTitle('Add/Update user detail')
              }}
            >
              <img
                src={Plusicon}
                style={{
                  width: '1rem',
                  marginRight: '0.2rem',
                }}
                className={'me-2'}
              />
              {'Add'}
            </div>
          )}
          <div className="pagination my-3">
            <Pagination
              showQuickJumper
              current={pageNoCall}
              showSizeChanger={false}
              total={totalPages * 10}
              onChange={onChange}
              style={{ border: 'none' }}
            />
          </div>
        </div>
      </div>
      {openBasicDeleteModal && (
        <DeleteModal
          setShow={setOpenBasicDeleteModal}
          show={openBasicDeleteModal}
          title={'Are you sure want to delete this user?'}
          runDelete={deleteSingleUser}
          saveAndExit={saveAndExitModal}
          data={deleteEmail}
          req={'User'}
        />
      )}
      {openModal && (
        <UserDetailsModal
          show={openModal}
          key={backendData[dataToChange]?.id}
          title={modelTitle}
          DetailsModal
          data={backendData[dataToChange]}
          change={changeModal}
          saveAndExit={saveAndExitModal}
        />
      )}
    </>
  )
}

export default UserListView
