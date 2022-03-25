import React, { useEffect, useRef, useState } from 'react'
import SecondaryHeading from '../../../components/Secondary Heading'
import DataTable, { createTheme } from 'react-data-table-component'
import './style.css'
import { Pagination, Select } from 'antd'
import Dropdown from '../../../components/Dropdown'
import UserDetailsModal from '../../../components/Modals/User Detail Modal'
import API from '../../../utils/api'
import { toast } from 'react-toastify'
import { getUserRoles } from '../../../utils/token'
import DeleteModal from '../../../components/Modals/Delete Modal/DeleteModal'
import { useDetectClickOutside } from 'react-detect-click-outside'
import Plusicon from '../../../assets/Group 331.png'
import Filtermg from '../../../assets/Icon awesome-filter.png'
import Deleteimg from '../../../assets/Icon material-delete.png'
import { useLoading } from '../../../utils/LoadingContext'

const NEW_TO_OLD = 'New to Old'
const OLD_TO_NEW = 'Old to New'
const A_TO_Z = 'A to Z'
const Z_TO_A = 'Z to A'

const UserListView = () => {
  const { loading, setLoading } = useLoading()

  // states
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [modelTitle, setModalTitle] = useState('View User')
  const [changeModal, setChangeModal] = useState('')
  const [filterCheckboxPMK, setFilterCheckboxPMK] = useState(true)
  const [filterCheckboxCM, setFilterCheckboxCM] = useState(true)
  const [filterCheckboxUser, setFilterCheckboxUser] = useState(true)
  const [filterActive, setFilterActive] = useState('')

  const [selectedRowsState, setSelectedRowsState] = useState([])
  const dropdownData = ['PMK Administrator', 'Content Manager', 'User']
  const sortDropdownData = [NEW_TO_OLD, OLD_TO_NEW, A_TO_Z, Z_TO_A]
  const [showSortDropDown, setShowDropDown] = useState(false)

  const filter1Ref = useRef()
  const filter2Ref = useRef()
  const filterFromCheckbox1Ref = useRef()
  const filterFromCheckbox2Ref = useRef()
  const filterFromCheckbox3Ref = useRef()

  // // data from backedn to be stored here
  const [backendData, setBackendData] = useState([])
  const [dataToChange, setDataToChange] = useState()

  // refs
  let [contentRow, setContentRow] = useState([])
  const [reloadTable, setReloadTable] = useState(false)

  const [openBasicDeleteModal, setOpenBasicDeleteModal] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState('')
  const [sortMethod, setSortMethod] = useState(NEW_TO_OLD)
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
      name: 'E-mail',
      selector: row => row.companyEmail,
      grow: 2,
      minWidth: '15rem',
    },
    {
      name: (
        <div className="role-dropdown" style={{ zIndex: 100 }}>
          <div className="has-dropdown" onClick={() => setShowDropDown(!showSortDropDown)}>
            <img
              style={{ width: '14px', height: '14px' }}
              src={require('../../../assets/Rearrange order.png')}
            />
          </div>

          <div
            className="role-dropdown-sort dropdown mt-2"
            style={{
              display: showSortDropDown ? 'flex' : 'none',
            }}
          >
            {sortDropdownData.map((element, index) => (
              <span
                style={{
                  color: 'rgba(0,0,0,0.87)',
                  fontWeight: element == sortMethod ? '600' : '400',
                }}
                key={index}
                className="dropdown-element "
                onClick={() => {
                  setSortMethod(element)
                  setShowDropDown(false)
                  // _handleSort(element);
                }}
              >
                {element}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      name: 'Company',
      selector: row => row.company,
      width: '130px',
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
  ]

  useEffect(() => {
    filterFromCheckbox1Ref.current.checked = true
    filterFromCheckbox2Ref.current.checked = true
    filterFromCheckbox3Ref.current.checked = true
  }, [])

  const _handleSort = () => {
    setLoading(true)
    const updatedUserList = backendData
    debugger
    let sortedArray = []
    if (sortMethod == NEW_TO_OLD) {
      sortedArray = updatedUserList.sort((a, b) =>
        new Date(a.date_joined) > new Date(b.date_joined) ? 1 : -1
      )
    } else if (sortMethod == OLD_TO_NEW) {
      sortedArray = updatedUserList.sort((a, b) =>
        new Date(a.date_joined) < new Date(b.date_joined) ? 1 : -1
      )
    } else if (sortMethod == A_TO_Z) {
      sortedArray = updatedUserList.sort((a, b) =>
        a.first_name.toLowerCase() > b.first_name.toLowerCase() ? 1 : -1
      )
    } else if (sortMethod == Z_TO_A) {
      sortedArray = updatedUserList.sort((a, b) =>
        a.first_name.toLowerCase() < b.first_name.toLowerCase() ? 1 : -1
      )
    } else {
      toast.error('No Filtes found')
      return
    }
    if (sortedArray.length > 0) {
      setBackendData(p => sortedArray)
      toast.success('Filters applied')
    } else {
      toast.error('Can not apply filter')
    }
    setLoading(false)
  }

  // const customSort = () => {
  //   return rows.sort((a, b) => {
  //     	// use the selector to resolve your field names by passing the sort comparators
  //     	const aField = selector(a).toLowerCase();
  //     		const bField = selector(b).toLowerCase();

  //     	let comparison = 0;

  //   		if (aField > bField) {
  //   			comparison = 1;
  //   		} else if (aField < bField) {
  //   			comparison = -1;
  //   		}

  //     		return direction === 'desc' ? comparison * -1 : comparison;
  //   	});
  // }

  useEffect(() => {
    _handleSort(sortMethod)
  }, [sortMethod])

  useEffect(async () => {
    const payload = {
      pmk_admin: filterCheckboxPMK,
      content_manager: filterCheckboxCM,
      user: filterCheckboxUser,
      filter: filterActive,
      page_index: 1,
    }

    _getUserList(payload)
  }, [reloadTable, filterActive])

  useEffect(async () => {
    const payload = {
      pmk_admin: filterCheckboxPMK,
      content_manager: filterCheckboxCM,
      user: filterCheckboxUser,
      filter: filterActive,
      page_index: pageNoCall,
    }

    _getUserList(payload)
  }, [pageNoCall])

  const _getUserList = async payload => {
    setLoading(true)

    const listuserdata = await API.post('admin/list_users', payload)
    console.log(listuserdata)

    setTotalPages(listuserdata.data.total_pages)
    const contentRowData = []
    listuserdata.data?.page_data.map((data, index) => {
      contentRowData.push({
        name: (
          <span
            style={{
              cursor: 'pointer',
            }}
            onClick={() => {
              setChangeModal('View')
              setOpenModal(true)
              setModalTitle('View User Detail')
              document.body.scrollTop = 0
              document.documentElement.scrollTop = 0
              document.body.style.overflow = 'hidden'
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
            addOrEditUser={addOrEditUser}
            userData={data}
          />
        ),
        companyEmail: data.email,
        status: data.status,
        company: data.company_name,
        edit: (getUserRoles() == 'PMK Administrator' ||
          getUserRoles() == 'Technical Administrator') && (
          <div className="edit-icons" key={index}>
            <i
              className="fa-solid fa-pen-to-square"
              data={dropdownData}
              style={{
                color: 'var(--bgColor2)',
              }}
              onClick={() => {
                setChangeModal('Edit')
                setOpenModal(true)
                setModalTitle('Update user dialog')

                document.body.scrollTop = 0
                document.documentElement.scrollTop = 0
                document.body.style.overflow = 'hidden'
                setDataToChange(index)
              }}
            />
            {/* <i
              className="fa-solid fa-trash"
              style={{
                color: '#CD2727',
              }}
              onClick={() => {
                // delete single user
                setDeleteEmail(data.email)
                setOpenBasicDeleteModal(true)
              }}
            /> */}
          </div>
        ),
      })
    })

    setBackendData(listuserdata.data?.page_data)
    setContentRow(contentRowData)
    setLoading(false)
  }

  const conditionalRowStyles = [
    {
      when: row => row.id % 2 != 0,
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

  const saveAndExitModal = data => {
    if (data?.email && data) {
      addOrEditUser(data)
      setOpenModal(false)
    } else {
      setOpenModal(false)
    }
    setOpenBasicDeleteModal(false)
    // document.body.style.overflow = 'scroll'
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

  const addOrEditUser = async data => {
    const payload = {
      email_id: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      role: data.role,
      password: data.password,
      company_name: data.company_name,
    }

    if (payload.email_id != '') {
      const afterAddOrDeleteMsg = await API.post('admin/upsert_user', payload)
      debugger
      if (data.imageFile) {
        const formData = new FormData()
        formData.append('image', data.imageFile)
        formData.append('data', JSON.stringify({ email: data.email }))
        await API.post('auth/update_avatar', formData)
          .then(data => {
            setReloadData(true)
          })
          .catch(error => {
            // toast.error('Error while updating Avatar')
          })
      }
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

  const closeDropdown = () => {
    setShowFilterDropdown(false)
  }

  const ref = useDetectClickOutside({ onTriggered: closeDropdown })

  return (
    <div className="user-list-view">
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
          key={backendData[dataToChange].id}
          title={modelTitle}
          DetailsModal
          data={backendData[dataToChange]}
          change={changeModal}
          saveAndExit={saveAndExitModal}
        />
      )}

      <SecondaryHeading title={'Users list view'} />

      <div className="filter-actions">
        <div className="filter-icons" ref={ref}>
          <img
            src={Filtermg}
            onClick={() => {
              setShowFilterDropdown(!showFilterDropdown)
            }}
          />

          <div
            className="filter-dropdown dropdown"
            style={{
              display: showFilterDropdown ? 'flex' : 'none',
            }}
          >
            <span
              className="dropdown-element"
              ref={filter1Ref}
              onClick={() => {
                if (filterActive == 'active') {
                  filterTable('')
                  filter1Ref.current.style.fontWeight = '300'
                } else {
                  filterTable('active')
                  filter1Ref.current.style.fontWeight = 'bold'
                  filter2Ref.current.style.fontWeight = '300'
                }
              }}
            >
              Active
            </span>
            <span
              className="dropdown-element"
              ref={filter2Ref}
              onClick={() => {
                if (filterActive == 'inactive') {
                  filterTable('')
                  filter2Ref.current.style.fontWeight = '300'
                } else {
                  filterTable('inactive')
                  filter2Ref.current.style.fontWeight = 'bold'
                  filter1Ref.current.style.fontWeight = '300'
                }
              }}
            >
              Inactive
            </span>
          </div>
          {/* {getUserRoles() == 'PMK Administrator' && (
            <i
              className="fa-solid fa-trash"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                deleteUser()
                setReloadTable(!reloadTable)
              }}
            />
          )} */}
        </div>
        <div className="filter-actions mgt">
          <div className="filter-checkbox d-flex align-items-center">
            <input
              type="checkbox"
              ref={filterFromCheckbox1Ref}
              value="PMK Administrator"
              onChange={e => {
                if (e.target.checked) {
                  setFilterCheckboxPMK(true)
                  setReloadTable(!reloadTable)
                } else {
                  setFilterCheckboxPMK(false)
                  setReloadTable(!reloadTable)
                }
              }}
            />
            &nbsp; PMK Administrator
          </div>
          <div className="filter-checkbox d-flex align-items-center">
            <input
              type="checkbox"
              ref={filterFromCheckbox2Ref}
              value="Content Manager"
              onChange={e => {
                if (e.target.checked) {
                  setFilterCheckboxCM(true)
                  setReloadTable(!reloadTable)
                } else {
                  setFilterCheckboxCM(false)
                  setReloadTable(!reloadTable)
                }
              }}
            />
            &nbsp; Content Manager
          </div>
          <div className="filter-checkbox d-flex align-items-center">
            <input
              type="checkbox"
              ref={filterFromCheckbox3Ref}
              value="User"
              onChange={e => {
                if (e.target.checked) {
                  setFilterCheckboxUser(true)
                  setReloadTable(!reloadTable)
                } else {
                  setFilterCheckboxUser(false)
                  setReloadTable(!reloadTable)
                }
              }}
            />
            &nbsp; User
          </div>
        </div>
      </div>
      <div className="user-list-view-table">
        <DataTable
          onSort={_handleSort}
          columns={columns}
          data={contentRow}
          selectableRows
          customStyles={customStyles}
          conditionalRowStyles={conditionalRowStyles}
          onSelectedRowsChange={selectedRowsAction}
        />

        {(getUserRoles() == 'PMK Administrator' || getUserRoles() == 'Technical Administrator') && (
          <div
            className="add_row"
            style={{ fontSize: '1rem', background: 'none' }}
            onClick={() => {
              document.body.scrollTop = 0
              document.documentElement.scrollTop = 0
              document.body.style.overflow = 'hidden'
              setChangeModal('Add')
              setOpenModal(true)
              setModalTitle('Add/Update user dialog')
            }}
          >
            <img
              src={Plusicon}
              style={{
                width: '1rem',
                marginRight: '0.2rem',
              }}
              className={'mr-2'}
            />
            {'Add'}
          </div>
        )}
      </div>
      {/* <Pagination noOfPages={10} /> */}
      <div className="pagination">
        <Pagination
          showQuickJumper
          showSizeChanger={false}
          total={totalPages * 10}
          onChange={onChange}
          style={{ border: 'none' }}
        />
      </div>
    </div>
  )
}

export default UserListView
