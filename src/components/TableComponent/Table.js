import React, { useEffect, useState, useRef } from 'react'
import DataTable from 'react-data-table-component'
import Plusicon from '../../assets/Group 331.png'
import accept from '../../assets/Icon ionic-md-checkmark-circle.png'
import decline from '../../assets/Icon ionic-md-close-circle.png'
import { Image } from 'react-bootstrap'
import API from '../../utils/api'
import { toast } from 'react-toastify'
import { getToken, getUserRoles } from '../../utils/token'
import ic_link from '../../assets/link_icon.png'
import upload_link from '../../assets/Icon awesome-file-upload.png'
import Uploadicon from '../../assets/Icon awesome-file-download.png'
import { Modal } from 'react-bootstrap'
import { useLoading } from '../../utils/LoadingContext'
import Tooltip from '@mui/material/Tooltip'

/**
 *
 * @param tableObject : { id, table_name, category_name, order, is_archived, type, table_data: [
 *   {
 *                      id,
                        column_name,
                        is_sortable,
                        is_link,
                        is_filterable,
                        is_date,
                        table_id,
                        values: [{
                                 "id": 35,
                                "column_name": "Column1",
                                "row_index": 1,
                                "value": "value 1",
                                "table_id": 12
                                }
                        ]
 *   }
 * ]}
 *
 */
export default ({
  table_id,
  tableObject,
  setShowDeleteModal,
  onRefresh,
  isAdmin,
  isTableEditable,
  onDeleteComponent,
  onLinkClick,
  onUploadClick,
  table_name,
  onEditableClick,
  archivedFilter,
  onTableUpdate,
  isRYG = false,
  handleFileUpload,
  extractedData,
  setExtractedData,
  tableId,
  editableBulk,
}) => {
  const [tableRows, setTableRows] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [isEditable, setIsEditable] = useState(false)
  const [bulkEditable, setBulkEditable] = useState(false)
  const [sortMethod, setSortMethod] = useState('')
  const [editedTableObject, setEditedTableObject] = useState(tableObject)
  const [editSelected, setEditSelected] = useState(null)
  const [deleteSelected, setDeleteSelected] = useState(null)
  const [archiveSelected, setArchiveSelected] = useState(null)
  const [unarchiveSelected, setUnarchiveSelected] = useState(null)
  const [updatedProductFile, setUpdatedProductFile] = useState(null)
  const [uploadInProgress, setUploadInProgress] = useState(false)
  const { setLoading } = useLoading()
  const [fileData, setFileData] = useState({})
  const inputRef = useRef([])
  const customStyles = {
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
    row: {
      style: {
        border: '2px solid black',
        borderLeft: 'none',
        borderRight: 'none',
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
        backgroundColor: 'var(--bgColor2)',
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'capitalize',
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

  const inputEditStyle = {
    borderBottom: '1px solid rgb(0, 79, 155)',
    borderTop: 'none',
    borderRight: 'none',
    borderLeft: 'none',
    maxWidth: 'max-content',
  }

  useEffect(() => {
    if (extractedData && extractedData.length > 0) {
      setBulkEditable(true)
    } else {
      setBulkEditable(false)
    }
  }, [extractedData])

  useEffect(() => {
    if (editableBulk == false) {
      setBulkEditable(false)
      setIsEditable(false)
    } else {
    }
  }, [editableBulk])

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
    if (updatedProductFile !== null) {
      formData.append('file', updatedProductFile)
    }
    let updateUrl = isRYG ? '/ryg_info/page/update_table_data' : '/products/page/update_table_data'
    API.post(updateUrl, formData)
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          if (res.data?.message) {
            toast.success(res.data?.message)
          }
        }
        setEditSelected(null)
        setUpdatedProductFile(null)
        onEditableClick()
        onRefresh()
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  const archiveRow = row => {
    let payload = {
      id: row.table_id,
      archive_type: 'component',
      component_type: 'table row',
      row_index: row.row_index,
    }
    let archiveUrl = isRYG ? '/ryg_info/page/set_archive' : '/products/page/set_archive'
    API.post(archiveUrl, payload)
      .then(data => {
        toast.success('Row archived successfully')
        setArchiveSelected(null)
        onEditableClick()
        onRefresh()
        _setTableHeaders()
        _setTableData()
        onTableUpdate(editedTableObject)
      })
      .catch(err => {
        toast.error('Error in Archiving')
      })
  }
  const unArchiveRow = row => {
    let payload = {
      id: row.table_id,
      archive_type: 'component',
      component_type: 'table row',
      row_index: row.row_index,
    }
    let archiveUrl = isRYG ? '/ryg_info/page/unarchive' : '/products/page/unarchive'
    API.post(archiveUrl, payload)
      .then(data => {
        toast.success('Row unarchived successfully')
        setUnarchiveSelected(null)
        onEditableClick()
        onRefresh()
        _setTableHeaders()
        _setTableData()
        onTableUpdate(editedTableObject)
      })
      .catch(err => {
        toast.error('Error in unarchiving')
      })
  }

  const deleteRow = item => {
    let deleteUrl = isRYG ? '/ryg_info/page/delete_table_row' : '/products/page/delete_table_row'
    API.post(deleteUrl, {
      table_id: item.table_id,
      row_index: item.row_index,
    })
      .then(data => {
        toast.success('Row deleted successfully')
        setDeleteSelected(null)
        setEditSelected(null)
        setIsEditable(false)
        onEditableClick()
        onRefresh()
        _setTableHeaders()
        _setTableData()
        onTableUpdate(editedTableObject)
      })
      .catch(err => {})
  }

  const _setTableHeaders = sort => {
    let tableColumns = []
    if (isTableEditable && editSelected != null) {
      tableColumns.push({
        name: 'Edit File',
        selector: row => row.editFile,
      })
    }
    tableObject?.map((column, index) => {
      const tempColumnName = column.column_name
      if (!column.is_filterable) {
        tableColumns.push({
          name: column.column_name,
          selector: row => row[tempColumnName],
          wrap: true,
          sortable: column.is_sortable,
          isLink: column.is_link,
          isDate: column.is_date,
          filterable: column.is_filterable,
        })
      } else {
        const filters = column.values.map(item => item.value)
        // remove duplicates from filters
        const uniqueFilters = filters.filter((item, index) => filters.indexOf(item) === index)
        tableColumns.push({
          name: (
            <div className="dropdown">
              <div
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                className="dropdown-toggle"
                src={require('../../assets/Rearrange order.png')}
              >
                {column.column_name}
              </div>

              <div className="dropdown-menu">
                <span
                  style={{
                    color: 'rgba(0,0,0,0.87)',
                    fontWeight: '400',
                  }}
                  className="dropdown-item filter-item"
                  onClick={() => {
                    setSortMethod('')
                    handleSort(column.column_name, undefined)
                    _setTableHeaders(undefined)
                  }}
                >
                  <i>Clear Filter</i>
                </span>
                {uniqueFilters.map((element, index) => (
                  <span
                    style={{
                      color: 'rgba(0,0,0,0.87)',
                      fontWeight: element === sort ? '600' : '400',
                    }}
                    key={index}
                    className="dropdown-item filter-item"
                    onClick={() => {
                      if (element !== sort) {
                        setSortMethod(element)
                        handleSort(column.column_name, element)
                        _setTableHeaders(element)
                      } else {
                        setSortMethod('')
                        handleSort(column.column_name, undefined)
                        _setTableHeaders(undefined)
                      }
                    }}
                  >
                    {element}
                  </span>
                ))}
              </div>
            </div>
          ),
          selector: row => row[tempColumnName],
          wrap: true,
          sortable: column.is_sortable,
          isLink: column.is_link,
          isDate: column.is_date,
          filterable: column.is_filterable,
        })
      }
    })
    tableColumns = tableColumns.filter(column => column.name != 'File')
    tableColumns.push({
      name: '',
      selector: row => row.edit,
    })
    setTableHeader([...tableColumns])
  }
  const handleSort = (column, type) => {
    const tableData = tableObject
    const finalTableData = []
    tableData &&
      tableData[0]?.values?.map((item, index) => {
        const tableRowObject = {
          id: item.id,
        }

        tableData?.map(column_name => {
          const tempObject = new Object()
          let value = column_name.values[index]?.value
          if (column_name.is_link) {
            value = (
              <a href={value + `?token=${getToken()}`} target="_blank">
                {value}
              </a>
            )
          }
          tempObject[column_name['column_name']] = value
          Object.assign(tableRowObject, tempObject)
        })
        finalTableData.push(tableRowObject)
      })
    if (type) {
      const filteredItems = finalTableData.filter(item => item[column] === type)
      setTableRows([...filteredItems])
    } else {
      setTableRows([...finalTableData])
    }
  }

  const handleChange = (name, value, index, file = null) => {
    setEditedTableObject(prevState => {
      let arr = [...prevState]
      const columnIndex = arr.findIndex(ele => ele.column_name === name)
      if (columnIndex !== -1) {
        try {
          arr[columnIndex].isEdited = true
          arr[columnIndex].values[index].isEdited = true
          arr[columnIndex].values[index].value = value
          if (file != null) setUpdatedProductFile(file)
        } catch (error) {
          console.log(error)
        }
      }
      return arr
    })
  }

  const _setTableData = () => {
    const tableData = isTableEditable ? editedTableObject : tableObject
    const finalTableData = []
    tableData &&
      tableData[0]?.values?.map((item, index) => {
        const tableRowObject = {
          id: item.id,
        }
        const fileLinks = tableData.find(ele => ele.column_name == 'File')
        tableData?.map((column_name, column_index) => {
          const tempObject = new Object()
          const row_i = column_name.values[index]?.row_index
          let value = column_name.values[index]?.value
          let link = fileLinks?.values[index].value || '#'
          if (column_name.column_name === 'Name') {
            let name = value
            value =
              editSelected === row_i && isTableEditable ? (
                <input
                  style={inputEditStyle}
                  type={item.isDate ? 'date' : 'text form-control'}
                  value={name}
                  onChange={e => handleChange(column_name['column_name'], e.target.value, index)}
                />
              ) : (
                <a href={link + `?token=${getToken()}`} target="_blank">
                  {value}
                </a>
              )
          } else if (column_name.is_link) {
            value =
              editSelected === row_i && isTableEditable ? (
                <input
                  style={inputEditStyle}
                  type={item.isDate ? 'date' : 'text form-control'}
                  value={value}
                  onChange={e => handleChange(column_name['column_name'], e.target.value, index)}
                />
              ) : (
                <a href={value + `?token=${getToken()}`} target="_blank">
                  {value}
                </a>
              )
          } else if (column_name.is_file) {
            value =
              editSelected === row_i && isTableEditable ? (
                <input
                  style={inputEditStyle}
                  type={item.isDate ? 'date' : 'text form-control'}
                  value={value}
                  onChange={e => handleChange(column_name['column_name'], e.target.value, index)}
                />
              ) : (
                <a href={value + `?token=${getToken()}`} download>
                  <img
                    src={Uploadicon}
                    style={{ width: '15px', marginRight: '10px' }}
                    alt={'FileImage'}
                  />
                </a>
              )
          } else {
            value =
              editSelected === row_i && isTableEditable ? (
                <input
                  style={inputEditStyle}
                  type={item.isDate ? 'date' : 'text form-control'}
                  disabled={
                    column_name.column_name === 'Type' || column_name.column_name === 'Size'
                  }
                  value={value}
                  onChange={e => handleChange(column_name['column_name'], e.target.value, index)}
                />
              ) : (
                value
              )
          }
          tempObject[column_name['column_name']] = value
          Object.assign(tableRowObject, tempObject)
        })
        if (isTableEditable) {
          if (archivedFilter) {
            tableRowObject.edit = (
              <div>
                {!isRYG && (
                  <Tooltip title={`${archivedFilter ? 'Unarchive' : 'Archive'}`}>
                    <i
                      className="fa-solid fa-box-archive theme"
                      style={{
                        marginRight: '1rem',
                      }}
                      role={'button'}
                      onClick={() => {
                        archivedFilter ? setUnarchiveSelected(item) : setArchiveSelected(item)
                      }}
                    />
                  </Tooltip>
                )}
              </div>
            )
          } else {
            tableRowObject.edit = (
              <div>
                {editSelected === item.row_index ? (
                  <Tooltip title="Save Changes">
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
                  </Tooltip>
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
                {!isRYG &&
                  !archivedFilter && ( // Added the condition here
                    <Tooltip title={`${archivedFilter ? 'Unarchive' : 'Archive'}`}>
                      <i
                        className="fa-solid fa-box-archive theme"
                        style={{
                          marginRight: '1rem',
                        }}
                        role={'button'}
                        onClick={() => {
                          archivedFilter ? setUnarchiveSelected(item) : setArchiveSelected(item)
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
          }
          if (editSelected == item.row_index) {
            tableRowObject.editFile = (
              <input
                style={{
                  all: 'initial',
                }}
                type={'file'}
                onChange={e => {
                  handleChange('File', '', index, e.target.files[0])
                }}
              />
            )
          }
        }
        finalTableData.push(tableRowObject)
      })
    setTableRows([...finalTableData])
  }
  const customSort = (rows, selector, direction) => {
    return rows.sort((a, b) => {
      // use the selector to resolve your field names by passing the sort comparitors
      // console.log("A", selector(a))
      // console.log("B", selector(b))
      const aField =
        selector(a).type === 'a'
          ? selector(a).props.children.toLowerCase()
          : selector(a).toLowerCase()
      const bField =
        selector(b).type === 'a'
          ? selector(b).props.children.toLowerCase()
          : selector(b).toLowerCase()

      let comparison = 0

      if (aField > bField) {
        comparison = 1
      } else if (aField < bField) {
        comparison = -1
      }
      return direction === 'desc' ? comparison * -1 : comparison
    })
  }
  const callAddRowAPI = async () => {
    // setUploadInProgress(true)
    let data = []
    let file = undefined
    tableObject.forEach(col => {
      /*if (col?.is_file === false) */ data.push({ column_name: col.column_name /*, values*/ })
    })
    // let dataIdx = 0
    inputRef.current.forEach((input, idx) => {
      if (input?.files && input?.files[0]) {
        file = input.files[0]
        data[idx] = { ...data[idx], values: /*...data[idx].values,*/ '' }
      } else {
        data[idx] = { ...data[idx], values: /*...data[idx].values,*/ input.value }
        // dataIdx++
      }
    })

    const payload = {
      table_id: tableObject[0].table_id,
      action_type: 'add_row',
      data: data,
    }
    const formData = new FormData()
    formData.append('data', JSON.stringify(payload))
    if (file !== undefined) {
      formData.append('file', file)
    }
    const response = await API.post(
      !isRYG ? '/products/page/update_table_data' : '/ryg_info/page/update_table_data',
      formData
    )
    toast.success(response.data.message)
    onRefresh()
    setIsEditable(false)
    setUploadInProgress(false)
  }

  const renderDummyRow = () => {
    return (
      <div className="add-row d-none d-lg-flex overflow-auto">
        {tableObject.map((ele, idx) => {
          let typeOrSizeColumn = ele.column_name === 'Type' || ele.column_name === 'Size'
          return (
            <div
              className="dummy-col"
              style={{
                minWidth:
                  ele.column_name !== 'File' && ele.column_name !== 'Classification'
                    ? '100px'
                    : 'none',
                maxWidth: ele.column_name == 'Classification' ? '150px' : 'none',
              }}
            >
              {!ele.is_file ? (
                <input
                  ref={el => (inputRef.current[idx] = el)}
                  disabled={typeOrSizeColumn}
                  placeholder={ele.column_name}
                  style={{ backgroundColor: typeOrSizeColumn ? '#f5f5f5' : '#fff' }}
                />
              ) : (
                <input ref={el => (inputRef.current[idx] = el)} type="file" />
              )}
              {tableObject.length === idx + 1 && (
                <>
                  <Tooltip title="Cancel">
                    <Image
                      role={'button'}
                      src={decline}
                      className="ms-2"
                      onClick={() => {
                        setIsEditable(false)
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Save Row">
                    <Image
                      role={'button'}
                      src={accept}
                      className="mx-2"
                      onClick={() => {
                        if (inputRef.current[idx].value === '') {
                          toast.error('Cannot add with empty data')
                          return
                        }
                        if (uploadInProgress) {
                          toast.error('Upload in progress')
                          return
                        }
                        callAddRowAPI()
                      }}
                    />
                  </Tooltip>
                </>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Bulk update table data function

  const handleUploadData = () => {
    // Perform the upload process using extractedData
    // Pass extractedData to the API endpoint or perform the necessary operations here
    // Example code to send the data to an API endpoint:
    const increment = tableRows.length
    console.log(extractedData)
    const modifiedData = extractedData.map(row => {
      const modifiedRow = {
        ...row,
        data: [
          ...row.data,
          { column_name: 'File', values: '' },
          { column_name: 'Type', values: '' },
          { column_name: 'Size', values: '' },
        ],
      }
      return modifiedRow
    })

    // Update the row_id in the extractedData array
    const updatedData = modifiedData.map(item => ({
      ...item,
      row_id: item.row_id + increment,
    }))

    const formData = new FormData()

    // Add the table ID and extracted data to the form data
    formData.append('data', JSON.stringify({ table_id: tableId, rows_data: updatedData }))

    // Add the file data to the form data
    Object.keys(fileData).forEach(rowId => {
      const file = fileData[rowId]
      formData.append(`row_${parseInt(rowId) + increment}`, file)
    })

    API.post('products/page/bulk_update_table_data', formData)
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          if (res.data?.message) {
            toast.success(res.data?.message)
            setExtractedData([])
            setIsEditable(false)
            onRefresh()
            setBulkEditable(false)
            modifiedData = {}
          }
        }
      })
      .catch(err => {
        toast.error(err)
        // Handle error
      })
  }

  // Handle Cancel Upload
  const handleCancelUpload = () => {
    setExtractedData([])
    setIsEditable(false)
    setBulkEditable(false)
    toast.error('Data Upload Cancelled')
  }

  // Rows to be shown when a file is uploaded and parsed

  const renderDummyRows = () => {
    // Function to handle file inputs after excel sheet is parsed

    const handleFileInputChange = (rowId, file) => {
      setFileData(prevFileData => ({
        ...prevFileData,
        [rowId]: file,
      }))
    }
    return (
      <>
        {extractedData.map((row, idx) => (
          <div className="dummy-row" key={idx} style={{ display: 'flex' }}>
            {row.data.map((column, colIdx) => (
              <input
                key={colIdx}
                ref={el => (inputRef.current[idx] = el)}
                type={column.column_name === 'File' ? 'file' : 'text'}
                disabled={column.column_name === 'Type' || column.column_name === 'Size'}
                placeholder={column.column_name}
                style={{
                  backgroundColor:
                    column.column_name === 'Type' || column.column_name === 'Size'
                      ? '#f5f5f5'
                      : '#fff',
                }}
                value={column.values}
                onChange={e => handleInputChange(idx, colIdx, e.target)}
              />
            ))}
            <input type="text" disabled placeholder="Type" />
            <input type="text" disabled placeholder="Size" />
            <input
              type="file"
              onChange={e => handleFileInputChange(row.row_id, e.target.files[0])}
            />
          </div>
        ))}
        <div className="add-row d-none d-lg-flex overflow-auto">
          {extractedData.length > 0 && (
            <div className="d-flex justify-content-end">
              <button className="btn btn-primary" onClick={handleUploadData}>
                Upload Data
              </button>
              <button className="btn mx-2 btn-primary" onClick={handleCancelUpload}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </>
    )
  }

  // Function to handle input change after file upload and parsing

  const handleInputChange = (rowIdx, colIdx, target) => {
    const file = target.files && target.files[0]
    if (file) {
      const updatedData = [...extractedData]
      updatedData[rowIdx].data[colIdx].values = file
      setExtractedData(updatedData)
    }
  }

  useEffect(() => {
    if (tableObject !== {}) {
      _setTableHeaders()
      _setTableData()
      setEditedTableObject(tableObject)
    }
  }, [tableObject, isTableEditable, editSelected])

  useEffect(() => {
    if (isTableEditable) {
      _setTableData()
    } else {
      setEditedTableObject(tableObject)
    }

    return () => {
      setEditedTableObject(tableObject)
    }
  }, [editedTableObject, isTableEditable])

  return (
    <>
      <div className="col-12 mt-4">
        <div className="row">
          <div className="col p-0 table-header d-flex align-items-center">
            <span style={{ fontSize: '1.25rem' }}>{table_name}</span>
          </div>
          {isAdmin && !archivedFilter && (
            <div className="col-auto my-2 p-0 d-none d-lg-block">
              <Tooltip title="Upload File">
                <Image
                  className="me-2"
                  style={{ width: '0.9rem' }}
                  role={'button'}
                  src={upload_link}
                  onClick={() => {
                    setBulkEditable(true)
                    setIsEditable(true)
                    onUploadClick()
                  }}
                />
              </Tooltip>
              <Tooltip title="Link Component">
                <Image
                  className="me-2"
                  style={{ width: '1.4rem' }}
                  role={'button'}
                  src={ic_link}
                  onClick={() => {
                    onLinkClick()
                  }}
                />
              </Tooltip>
              <Tooltip title={isTableEditable ? 'Save' : 'Edit Table'}>
                <i
                  role={'button'}
                  className={
                    !isTableEditable
                      ? 'fa-solid fa-pen-to-square me-2 theme'
                      : 'fa-solid fa-floppy-disk theme'
                  }
                  onClick={() => {
                    onEditableClick()
                    setEditSelected(null)
                    // if (isTableEditable) {
                    //   onTableUpdate(editedTableObject)
                    // }
                  }}
                />
              </Tooltip>
              <Tooltip title="Delete Table">
                <i
                  role={'button'}
                  className="fa-solid fa-trash ms-2 me-0"
                  onClick={() => {
                    onDeleteComponent()
                  }}
                ></i>
              </Tooltip>
            </div>
          )}
          {isAdmin && archivedFilter && (
            <div className="col-auto my-2 p-0 d-none d-lg-block">
              <Tooltip title={isTableEditable ? 'Save' : 'Edit Table'}>
                <i
                  role={'button'}
                  className={
                    !isTableEditable
                      ? 'fa-solid fa-pen-to-square me-2 theme'
                      : 'fa-solid fa-floppy-disk theme'
                  }
                  onClick={() => {
                    onEditableClick()
                    setEditSelected(null)
                    // if (isTableEditable) {
                    //   onTableUpdate(editedTableObject)
                    // }
                  }}
                />
              </Tooltip>
            </div>
          )}
        </div>
        <div className="row">
          <div className="border w-100 p-0 product-detail-table">
            <DataTable
              sortIcon={<i className="fa-solid fa-sort ms-1"></i>}
              pagination={false}
              paginationPerPage={false}
              fixedHeader
              columns={tableHeader}
              data={tableRows}
              customStyles={customStyles}
              persistTableHead
              sortFunction={customSort}
              // conditionalRowStyles={conditionalRowStyles}
              // selectableRows
              // onSelectedRowsChange={selectedRowsActionUA}
            />
            {isEditable && !bulkEditable ? (
              renderDummyRow()
            ) : isAdmin && !isTableEditable && !archivedFilter && !bulkEditable ? (
              <div
                role={'button'}
                className="add-row d-none d-lg-flex"
                onClick={() => {
                  setIsEditable(true)
                }}
              >
                <img
                  src={Plusicon}
                  style={{
                    width: '16px',
                    marginRight: '12px',
                  }}
                />
                Add
              </div>
            ) : null}

            {bulkEditable && isEditable ? renderDummyRows() : null}
          </div>
        </div>
      </div>
      <Modal
        show={
          (deleteSelected !== null && Object.keys(deleteSelected).length > 0) ||
          archiveSelected !== null ||
          unarchiveSelected != null
        }
        centered
        onHide={() => {
          setDeleteSelected(null)
          setArchiveSelected(null)
          setUnarchiveSelected(null)
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
          <Modal.Title>
            {deleteSelected !== null && Object.keys(deleteSelected).length > 0
              ? 'Delete Row'
              : archiveSelected !== null && Object.keys(archiveSelected).length > 0
              ? 'Archive Row'
              : unarchiveSelected !== null && Object.keys(unarchiveSelected).length > 0
              ? 'Unarchive Row'
              : ''}
          </Modal.Title>
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
          {deleteSelected !== null && Object.keys(deleteSelected).length > 0
            ? 'Are you sure you want to delete this row?'
            : archiveSelected !== null && Object.keys(archiveSelected).length > 0
            ? 'Are you sure you want to archive this row?'
            : unarchiveSelected !== null && Object.keys(unarchiveSelected).length > 0
            ? 'Are you sure you want to unarchive this row?'
            : ''}
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
              setArchiveSelected(null)
              setUnarchiveSelected(null)
            }}
          >
            Cancel
          </button>
          <button
            className="btn"
            onClick={() => {
              if (deleteSelected !== null && Object.keys(deleteSelected).length > 0) {
                deleteRow(deleteSelected)
              }
              if (archiveSelected !== null) {
                archiveRow(archiveSelected)
              }
              if (unarchiveSelected !== null) {
                unArchiveRow(unarchiveSelected)
              }
            }}
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
