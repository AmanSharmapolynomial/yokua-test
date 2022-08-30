import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useLoading } from '../../utils/LoadingContext'
import { getUserRoles } from '../../utils/token'
import Plusicon from '../../assets/Group 331.png'
import API from '../../../src/utils/api'
import { toast } from 'react-toastify'
import Uploadicon from '../../assets/Icon awesome-file-download.png'
import Tooltip from '@mui/material/Tooltip'
import { Modal } from 'react-bootstrap'

const TokuchuTable = ({ sectionName, tableObject, setShowDeleteModal, onRefresh, allRequest }) => {
  const [imageFile, setImageFile] = useState(null)
  const [tableRows, setTableRows] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [needToReload, setNeedToReload] = useState(false)
  const { setLoading } = useLoading()
  const [editModeData, setEditModeData] = useState([])

  const [emptyNewRow, setEmptyNewRow] = useState(null)
  const [rowName, setRowName] = useState({})
  const [isEdit, setEdit] = useState(false)
  const [deleteSelected, setDeleteSelected] = useState(null)
  const [editSelected, setEditSelected] = useState(null)
  const [editedTableObject, setEditedTableObject] = useState(tableObject.table_data)
  const [updatedTokuchuFile, setUpdatedTokuchuFile] = useState(null)
  const customStyles = {
    // table: {
    //   style: {
    //     width: '150%',
    //     maxWidth: '150%',
    //   },
    // },
    table: {
      style: {
        border: 'none',
      },
    },
    rows: {
      style: {
        border: '1px solid black',
      },
    },
    headRow: {
      style: {
        borderBottom: '1px solid var(--bgColor2)',
        fontSize: '0.8rem',
      },
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
    noData: {
      style: {
        border: '1px solid black',
      },
    },
  }
  const imageFileInputRef = useRef()

  const handleChange = (name, value) => {
    const updatedRowName = rowName
    updatedRowName[name] = value
    setRowName({ ...updatedRowName })
  }

  const handleTableDataChange = (name, value, index, file = null) => {
    setEditedTableObject(prevState => {
      let arr = [...prevState]
      const columnIndex = arr.findIndex(ele => ele.column_name === name)
      if (columnIndex !== -1) {
        try {
          arr[columnIndex].isEdited = true
          arr[columnIndex].values[index].isEdited = true
          arr[columnIndex].values[index].value = value
          if (file != null) setUpdatedTokuchuFile(file)
        } catch (error) {
          console.log(error)
        }
      }
      return arr
    })
  }

  const updateTableValues = tableObject => {
    setLoading(true)
    let payload = {
      action_type: 'update_cell',
      update_objs: [],
    }
    for (let index = 0; index < tableObject.length; index++) {
      if (tableObject[index].isEdited) {
        const values = tableObject[index].values.filter(value => value.isEdited)
        values.map(value => {
          payload.update_objs.push({
            table_id: value.table_id,
            column_name: value.column_name,
            row_index: value.row_index,
            value: value.value,
          })
        })
        //payload.update_objs.push(...values)
      }
    }
    const formData = new FormData()
    formData.append('data', JSON.stringify(payload))
    if (updatedTokuchuFile !== null) {
      formData.append('file', updatedTokuchuFile)
    }
    API.post('tokuchu/page/update_table_data', formData)
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          if (res.data?.message) {
            toast.success(res.data?.message)
          }
        }
        //getProductDetails()
        setEdit(false)
        setEditSelected(null)
        setLoading(false)
        onRefresh()
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  const _setTableHeaders = () => {
    const tableColumns = []
    tableObject.table_data?.map((column, index) => {
      const tempColumnName = column.column_name
      tableColumns.push({
        isEdit: isEdit,
        name: column.column_name,
        selector: row => row[tempColumnName],
        sortable: column.is_sortable,
        isLink: column.is_link,
        isDate: column.is_date,
        filterable: column.is_filterable,
      })
    })
    tableColumns.push({
      name: '',
      selector: row => row.edit,
    })
    setTableHeader([...tableColumns])
  }

  useEffect(() => {
    _setTableData()
  }, [editedTableObject])

  const _setTableData = (isAddNewRow = false) => {
    const tableData = tableObject.table_data
    const finalTableData = []
    tableData &&
      tableData[0]?.values?.map((item, index) => {
        const tableRowObject = {
          id: item.id,
        }

        tableData?.map((tableC, tableI) => {
          const tempObject = {}
          const row_i = tableC.values[index].row_index
          if (tableC['column_name'] === 'Tokuchu') {
            tempObject[tableC['column_name']] = (
              <>
                {editSelected === row_i && isEdit ? (
                  <input
                    style={{
                      all: 'initial',
                    }}
                    type={'file'}
                    onChange={e => {
                      handleTableDataChange(tableC['column_name'], '', index, e.target.files[0])
                    }}
                  />
                ) : (
                  <a href={tableC.values[index].value} download target={'_blank'}>
                    <img
                      src={Uploadicon}
                      style={{ width: '15px', marginRight: '10px' }}
                      alt={'FileImage'}
                    />
                  </a>
                )}
              </>
            )
          } else {
            {
              editSelected === row_i && isEdit
                ? (tempObject[tableC['column_name']] = (
                    <input
                      style={{
                        borderBottom: '1px solid rgb(0, 79, 155)',
                        borderTop: 'none',
                        borderRight: 'none',
                        borderLeft: 'none',
                      }}
                      type={tableC.is_date ? 'date' : 'text form-control'}
                      value={tableC.values[index].value}
                      onChange={e => {
                        handleTableDataChange(tableC['column_name'], e.target.value, index)
                      }}
                    />
                  ))
                : (tempObject[tableC['column_name']] = tableC?.values[index]
                    ? tableC?.values[index]?.value
                    : [])
            }
          }
          Object.assign(tableRowObject, tempObject)
        })
        if (isEdit)
          tableRowObject.edit = (
            <div>
              {editSelected == item.row_index ? (
                <i
                  className="fa-solid fa-floppy-disk theme"
                  style={{
                    marginRight: '1rem',
                  }}
                  role={'button'}
                  onClick={() => {
                    updateTableValues(editedTableObject)
                  }}
                />
              ) : (
                <Tooltip title="Edit Row">
                  <i
                    className="fa-solid fa-pen-to-square ms-2 theme"
                    style={{
                      marginRight: '1rem',
                    }}
                    role={'button'}
                    onClick={() => {
                      setEditSelected(item.row_index)
                    }}
                  />
                </Tooltip>
              )}
              <Tooltip title="Delete Row">
                <i
                  className="fa-solid fa-trash"
                  role={'button'}
                  onClick={() => {
                    setDeleteSelected(item)
                  }}
                />
              </Tooltip>
            </div>
          )
        finalTableData.push(tableRowObject)
      })
    if (emptyNewRow) {
      finalTableData.push(emptyNewRow)
    }
    setTableRows([...finalTableData])
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
  const _updateTableData = (image, payload, actionType = 'add_row') => {
    const formData = new FormData()
    if (!image) {
      toast.error('Please provide the Tokuchu')
      return
    }
    if (image) {
      formData.append('file', image)
    }

    formData.append('data', payload)
    API.post('tokuchu/page/update_table_data', formData)
      .then(data => {
        toast.success('New row added successfully')
        setRowName({})
        setEmptyNewRow(null)
        onRefresh()
      })
      .catch(err => {})
  }

  const deleteRow = item => {
    API.post('tokuchu/page/delete_table_row', {
      table_id: item.table_id,
      row_index: item.row_index,
    })
      .then(data => {
        toast.success('Row deleted successfully')
        setRowName({})
        setEmptyNewRow(null)
        onRefresh()
        setDeleteSelected(null)
      })
      .catch(err => {})
  }

  const handleImage = e => {
    setImageFile(e.event.files[0])
  }

  const addRow = () => {
    const tempObject = {
      isEdit: true,
      edit: (
        <div className="edit-icons">
          <div className="icon reject">
            <i
              className="fa-solid fa-xmark reject"
              onClick={() => {
                _setTableData()
                setRowName({})
                setEmptyNewRow(null)
              }}
              role="button"
            />
          </div>
          <div className="icon accept">
            <i
              role="button"
              className="fa-solid fa-check"
              onClick={() => {
                convertData()
              }}
            />
          </div>
        </div>
      ),
    }
    const rowHandler = {}
    tableHeader.map((item, index) => {
      rowHandler[item['name']] = ''
      if (item['name'] === 'Tokuchu') {
        tempObject[item['name']] = (
          <input
            ref={imageFileInputRef}
            id={Math.random().toString()}
            key={Math.random().toString()}
            type="file"
            onChange={handleImage}
          />
        )
      } else {
        tempObject[item['name']] = (
          <>
            <input
              style={{
                borderBottom: '1px solid rgb(0, 79, 155)',
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
              }}
              type={item.isDate ? 'date' : 'text form-control'}
              id={rowName[item['name']] + Math.random().toString()}
              key={rowName[item['name']] + Math.random().toString()}
              value={rowName[item['name']]}
              onChange={e => handleChange(item['name'], e.target.value)}
            />
          </>
        )
      }
    })

    setRowName(rowHandler)
    setEmptyNewRow(tempObject)
    setNeedToReload(!needToReload)
    document.body.style.overflow = 'auto'
  }

  const convertData = () => {
    let dataArray = []
    let isBlankValue = false
    const keys = Object.keys(rowName)
    keys.forEach(key => {
      if (rowName[key] == '' || !rowName[key]) {
        isBlankValue = true
      }
      dataArray.push({
        column_name: key,
        values: rowName[key],
      })
    })

    if (isBlankValue) {
      toast.error('Please fill in all the fields')
      return
    }

    const payload = {
      table_id: tableObject.id,
      data: dataArray,
      action_type: 'add_row',
    }
    _updateTableData(imageFileInputRef.current.files[0], JSON.stringify(payload))
  }

  useEffect(() => {
    _setTableData(true)
  }, [needToReload])

  useEffect(() => {
    if (tableObject != {}) {
      _setTableHeaders()
      _setTableData()
    }
  }, [tableObject, isEdit, editSelected])

  return (
    <>
      {!allRequest && (
        <h5 style={{ marginTop: '60px', marginBottom: '-5px', fontFamily: 'Noto Sans' }}>
          {sectionName}
        </h5>
      )}
      {tableObject &&
        tableObject !== {} &&
        (getUserRoles() == 'PMK Administrator' ||
          getUserRoles() == 'PMK Content Manager' ||
          getUserRoles() == 'Technical Administrator') &&
        !allRequest && (
          <div className="row text-primary d-none d-lg-flex">
            <div className="ms-auto w-auto my-2">
              {isEdit ? (
                <Tooltip title="Save Changes">
                  <i
                    role={'button'}
                    className="fa-solid fa-floppy-disk theme"
                    onClick={() => {
                      setEditModeData([...tableRows])
                      setEdit(false)
                      setEditSelected(null)
                    }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Edit Tokuchu">
                  <i
                    role={'button'}
                    className="fa-solid fa-pen-to-square ms-2 theme"
                    aria-hidden="true"
                    onClick={() => {
                      setEditModeData([...tableRows])
                      setEdit(true)
                    }}
                  />
                </Tooltip>
              )}
              {/* <i
                role={'button'}
                className="fa-solid fa-trash ms-2"
                onClick={() => {
                  setShowDeleteModal(true)
                }}
              /> */}
            </div>
          </div>
        )}
      <div className="row">
        <div className="border w-100 p-0">
          <DataTable
            sortIcon={<i className="fa-solid fa-sort ms-1"></i>}
            fixedHeader
            persistTableHead
            columns={tableHeader}
            data={tableRows}
            customStyles={customStyles}
            sortFunction={customSort}
          />
        </div>
      </div>
      {(getUserRoles() === 'PMK Administrator' || getUserRoles() === 'Technical Administrator') &&
        !allRequest && (
          <div
            className="add_row d-none d-lg-flex"
            style={{ fontSize: '1rem', background: 'none' }}
            onClick={() => {
              if (!emptyNewRow) {
                addRow()
              } else {
                toast.error('Please finish the current edit')
              }
            }}
          >
            <img
              src={Plusicon}
              style={{
                width: '1rem',
                marginRight: '0.2rem',
              }}
              className={'me-2'}
              alt={'icon'}
            />
            {'Add'}
          </div>
        )}
      <Modal
        show={deleteSelected !== null && Object.keys(deleteSelected).length > 0}
        centered
        onHide={() => {
          setDeleteSelected(null)
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
          <Modal.Title>Are you sure you want to delete row</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            borderBottom: '0',
            fontWeight: '600',
          }}
        >
          The row will be deleted
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
            className="btn btn-background me-4"
            onClick={() => {
              setDeleteSelected(null)
            }}
          >
            Cancel
          </button>
          <button
            className="btn"
            onClick={() => {
              deleteRow(deleteSelected)
            }}
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default TokuchuTable
