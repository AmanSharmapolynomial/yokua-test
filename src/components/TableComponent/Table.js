import React, { useEffect, useState, useRef } from 'react'
import DataTable from 'react-data-table-component'
import Plusicon from '../../assets/Group 331.png'
import accept from '../../assets/Icon ionic-md-checkmark-circle.png'
import decline from '../../assets/Icon ionic-md-close-circle.png'
import { Image } from 'react-bootstrap'
import API from '../../utils/api'
import { toast } from 'react-toastify'
import { getUserRoles } from '../../utils/token'
import ic_link from '../../assets/link_icon.png'
import Uploadicon from '../../assets/Icon awesome-file-download.png'

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
  tableObject,
  setShowDeleteModal,
  onRefresh,
  isAdmin,
  isTableEditable,
  onDeleteComponent,
  onLinkClick,
  table_name,
  onEditableClick,
  archivedFilter,
  onTableUpdate,
  isRYG = false,
}) => {
  const [tableRows, setTableRows] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [isEditable, setIsEditable] = useState(false)
  const [sortMethod, setSortMethod] = useState('')
  const [editedTableObject, setEditedTableObject] = useState(tableObject)
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

  const _setTableHeaders = sort => {
    let tableColumns = []
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
                {filters.map((element, index) => (
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
    // console.log("OOOOOOO", tableColumns)
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
              <a href={value} target="_blank">
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

  const handleChange = (name, value, index) => {
    setEditedTableObject(prevState => {
      let arr = [...prevState]
      const columnIndex = arr.findIndex(ele => ele.column_name === name)
      if (columnIndex !== -1) {
        try {
          arr[columnIndex].isEdited = true
          arr[columnIndex].values[index].isEdited = true
          arr[columnIndex].values[index].value = value
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
        // console.log("JJJJJJ", tableData)
        const fileLinks = tableData.find(ele => ele.column_name == 'File')
        console.log('FILE LINKS', fileLinks)
        tableData?.map((column_name, column_index) => {
          if (!isTableEditable) {
            const tempObject = new Object()
            let value = column_name.values[index]?.value
            let link = fileLinks?.values[index].value || '#'
            if (column_name.column_name === 'Name') {
              value = (
                <a href={link} target="_blank">
                  {value}
                </a>
              )
            }
            if (column_name.is_link) {
              value = (
                <a href={value} target="_blank">
                  {value}
                </a>
              )
            }
            if (column_name.is_file) {
              value = (
                <a href={value} download>
                  <img
                    src={Uploadicon}
                    style={{ width: '15px', marginRight: '10px' }}
                    alt={'FileImage'}
                  />
                </a>
              )
            }
            tempObject[column_name['column_name']] = value
            Object.assign(tableRowObject, tempObject)
          } else {
            const tempObject = new Object()
            let value = column_name.values[index]?.value
            tempObject[column_name['column_name']] = (
              <>
                <input
                  style={{
                    borderBottom: '1px solid rgb(0, 79, 155)',
                    borderTop: 'none',
                    borderRight: 'none',
                    borderLeft: 'none',
                  }}
                  type={item.isDate ? 'date' : 'text form-control'}
                  value={value}
                  onChange={e => handleChange(column_name['column_name'], e.target.value, index)}
                />
              </>
            )
            Object.assign(tableRowObject, tempObject)
          }
        })
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
  }

  const renderDummyRow = () => {
    return (
      <div className="add-row d-none d-lg-flex overflow-auto">
        {tableObject.map((ele, idx) => {
          let typeOrSizeColumn = ele.column_name === 'Type' || ele.column_name === 'Size'
          return (
            <div className="dummy-col" style={{ minWidth: '100px' }}>
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
                  <Image
                    role={'button'}
                    src={decline}
                    className="ms-2"
                    onClick={() => {
                      setIsEditable(false)
                    }}
                  />
                  <Image
                    role={'button'}
                    src={accept}
                    className="mx-2"
                    onClick={() => {
                      if (inputRef.current[idx].value === '') {
                        toast.error('Cannot add with empty data')
                        return
                      }
                      callAddRowAPI()
                    }}
                  />
                </>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  useEffect(() => {
    if (tableObject !== {}) {
      _setTableHeaders()
      _setTableData()
    }
  }, [tableObject, isTableEditable])

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
    <div className="col-12 mt-4">
      <div className="row">
        <div className="col p-0 table-header d-flex align-items-center">
          <span style={{ fontSize: '1.25rem' }}>{table_name}</span>
        </div>
        {isAdmin && !archivedFilter && (
          <div className="col-auto my-2 p-0 d-none d-lg-block">
            <Image
              className="me-2"
              style={{ width: '1.4rem' }}
              role={'button'}
              src={ic_link}
              onClick={() => {
                onLinkClick()
              }}
            />
            <i
              role={'button'}
              className={
                !isTableEditable
                  ? 'fa-solid fa-pen-to-square me-2 theme'
                  : 'fa-solid fa-floppy-disk theme'
              }
              onClick={() => {
                onEditableClick()
                if (isTableEditable) {
                  onTableUpdate(editedTableObject)
                }
              }}
            />
            <i
              role={'button'}
              className="fa-solid fa-trash ms-2 me-0"
              onClick={() => {
                onDeleteComponent()
              }}
            ></i>
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
          {isEditable ? (
            renderDummyRow()
          ) : isAdmin && !isTableEditable && !archivedFilter ? (
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
        </div>
      </div>
    </div>
  )
}
